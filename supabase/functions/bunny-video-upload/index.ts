// @ts-nocheck - Deno runtime (Supabase Edge Functions)
// Bunny Stream Video Upload Edge Function
// Handles video creation, upload, and status polling for Bunny Stream CDN

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BUNNY_API_KEY = Deno.env.get("BUNNY_API_KEY")!;
const BUNNY_LIBRARY_ID = Deno.env.get("BUNNY_LIBRARY_ID")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  try {
    // Verify user is authenticated (except for webhook)
    let userId: string | null = null;
    if (action !== "webhook") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

      if (error || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = user.id;
    }

    switch (action) {
      // ========================================
      // CREATE: Create video record in Bunny
      // ========================================
      case "create": {
        const body = await req.json();
        const { title, filename } = body;

        if (!title) {
          return new Response(
            JSON.stringify({ error: "Title is required" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // 1. Create video in Bunny Stream
        const createResponse = await fetch(
          `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
          {
            method: "POST",
            headers: {
              AccessKey: BUNNY_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
          }
        );

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error("Bunny create error:", errorText);
          throw new Error(`Bunny API error: ${createResponse.status}`);
        }

        const bunnyVideo = await createResponse.json();

        // 2. Create record in Supabase
        const { data: videoRecord, error: dbError } = await supabase
          .from("lesson_videos")
          .insert({
            bunny_video_id: bunnyVideo.guid,
            bunny_library_id: BUNNY_LIBRARY_ID,
            title,
            original_filename: filename || null,
            status: "created",
            uploaded_by: userId,
          })
          .select()
          .single();

        if (dbError) {
          console.error("DB insert error:", dbError);
          throw dbError;
        }

        // 3. Return video info with upload URL
        // Direct upload URL pattern for Bunny Stream
        const uploadUrl = `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${bunnyVideo.guid}`;

        return new Response(
          JSON.stringify({
            id: videoRecord.id,
            bunnyVideoId: bunnyVideo.guid,
            uploadUrl,
            // Client will use edge function's upload endpoint with this info
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ========================================
      // UPLOAD: Proxy video upload to Bunny
      // ========================================
      case "upload": {
        const bunnyVideoId = url.searchParams.get("videoId");

        if (!bunnyVideoId) {
          return new Response(
            JSON.stringify({ error: "videoId is required" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Update status to uploading
        await supabase
          .from("lesson_videos")
          .update({ status: "uploading" })
          .eq("bunny_video_id", bunnyVideoId);

        // Get the video file from request body
        const videoData = await req.arrayBuffer();

        // Upload to Bunny Stream
        const uploadResponse = await fetch(
          `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${bunnyVideoId}`,
          {
            method: "PUT",
            headers: {
              AccessKey: BUNNY_API_KEY,
              "Content-Type": "application/octet-stream",
            },
            body: videoData,
          }
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("Bunny upload error:", errorText);

          // Update status to failed
          await supabase
            .from("lesson_videos")
            .update({
              status: "failed",
              error_message: `Upload failed: ${uploadResponse.status}`,
            })
            .eq("bunny_video_id", bunnyVideoId);

          throw new Error(`Bunny upload error: ${uploadResponse.status}`);
        }

        // Update status to processing (Bunny is now encoding)
        await supabase
          .from("lesson_videos")
          .update({
            status: "processing",
            file_size_bytes: videoData.byteLength,
          })
          .eq("bunny_video_id", bunnyVideoId);

        return new Response(
          JSON.stringify({
            success: true,
            status: "processing",
            message: "Video uploaded, processing started",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ========================================
      // STATUS: Check video processing status
      // ========================================
      case "status": {
        const bunnyVideoId = url.searchParams.get("videoId");

        if (!bunnyVideoId) {
          return new Response(
            JSON.stringify({ error: "videoId is required" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Fetch status from Bunny
        const statusResponse = await fetch(
          `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${bunnyVideoId}`,
          {
            headers: { AccessKey: BUNNY_API_KEY },
          }
        );

        if (!statusResponse.ok) {
          throw new Error(`Bunny status error: ${statusResponse.status}`);
        }

        const bunnyStatus = await statusResponse.json();

        // Map Bunny status codes to our status enum
        // Bunny statuses: 0=created, 1=uploaded, 2=processing, 3=transcoding, 4=finished, 5=error
        let status: string;
        if (bunnyStatus.status === 4) status = "ready";
        else if (bunnyStatus.status === 5) status = "failed";
        else if (bunnyStatus.status >= 2) status = "processing";
        else if (bunnyStatus.status === 1) status = "uploading";
        else status = "created";

        // Build thumbnail URL if available
        const thumbnailUrl = bunnyStatus.thumbnailFileName
          ? `https://vz-${BUNNY_LIBRARY_ID}.b-cdn.net/${bunnyVideoId}/${bunnyStatus.thumbnailFileName}`
          : null;

        // Update our database with latest status
        const updateData: Record<string, unknown> = {
          status,
          duration_seconds: bunnyStatus.length
            ? Math.round(bunnyStatus.length)
            : null,
          thumbnail_url: thumbnailUrl,
        };

        if (status === "ready") {
          updateData.processing_completed_at = new Date().toISOString();
        }

        if (status === "failed") {
          updateData.error_message =
            bunnyStatus.errorMessage || "Processing failed";
        }

        await supabase
          .from("lesson_videos")
          .update(updateData)
          .eq("bunny_video_id", bunnyVideoId);

        // Get the full record to return
        const { data: videoRecord } = await supabase
          .from("lesson_videos")
          .select("*")
          .eq("bunny_video_id", bunnyVideoId)
          .single();

        return new Response(JSON.stringify(videoRecord), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ========================================
      // WEBHOOK: Receive Bunny encoding notifications
      // ========================================
      case "webhook": {
        const body = await req.json();
        const { VideoGuid, Status } = body;

        if (!VideoGuid) {
          return new Response(JSON.stringify({ error: "VideoGuid required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Map Bunny webhook status
        const status =
          Status === 4 ? "ready" : Status === 5 ? "failed" : "processing";

        const updateData: Record<string, unknown> = { status };

        if (status === "ready") {
          updateData.processing_completed_at = new Date().toISOString();

          // Fetch video details to get duration and thumbnail
          const detailResponse = await fetch(
            `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${VideoGuid}`,
            { headers: { AccessKey: BUNNY_API_KEY } }
          );

          if (detailResponse.ok) {
            const details = await detailResponse.json();
            updateData.duration_seconds = details.length
              ? Math.round(details.length)
              : null;
            if (details.thumbnailFileName) {
              updateData.thumbnail_url = `https://vz-${BUNNY_LIBRARY_ID}.b-cdn.net/${VideoGuid}/${details.thumbnailFileName}`;
            }
          }
        }

        await supabase
          .from("lesson_videos")
          .update(updateData)
          .eq("bunny_video_id", VideoGuid);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ========================================
      // DELETE: Remove video from Bunny and DB
      // ========================================
      case "delete": {
        const bunnyVideoId = url.searchParams.get("videoId");

        if (!bunnyVideoId) {
          return new Response(
            JSON.stringify({ error: "videoId is required" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Delete from Bunny
        const deleteResponse = await fetch(
          `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${bunnyVideoId}`,
          {
            method: "DELETE",
            headers: { AccessKey: BUNNY_API_KEY },
          }
        );

        // Even if Bunny delete fails, remove from our DB
        if (!deleteResponse.ok) {
          console.error("Bunny delete failed:", deleteResponse.status);
        }

        // Delete from our database
        await supabase
          .from("lesson_videos")
          .delete()
          .eq("bunny_video_id", bunnyVideoId);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(
          JSON.stringify({
            error: "Invalid action",
            validActions: ["create", "upload", "status", "webhook", "delete"],
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
