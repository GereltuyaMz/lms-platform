"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoUrlInputControlled } from "./VideoUrlInputControlled";
import { BunnyVideoUploader } from "./BunnyVideoUploader";
import type { LessonVideo } from "@/types/database/tables";

type VideoInputProps = {
  videoUrl: string | null;
  lessonVideoId: string | null;
  onVideoUrlChange: (url: string | null) => void;
  onLessonVideoChange: (videoId: string | null, video: LessonVideo | null) => void;
  label: string;
};

export const VideoInput = ({
  videoUrl,
  lessonVideoId,
  onVideoUrlChange,
  onLessonVideoChange,
  label,
}: VideoInputProps) => {
  // Default to upload tab always, only show url tab if actively has url and no bunny video
  const [activeTab, setActiveTab] = useState<string>("upload");

  const handleVideoReady = (video: LessonVideo) => {
    // Only call onLessonVideoChange - videoUrl is cleared atomically in LessonContentTab
    onLessonVideoChange(video.id, video);
  };

  const handleVideoRemoved = () => {
    onLessonVideoChange(null, null);
  };

  const handleUrlChange = (url: string | null) => {
    // Only call onVideoUrlChange - lessonVideoId is cleared atomically in LessonContentTab
    onVideoUrlChange(url);
  };

  return (
    <div className="space-y-3">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Байршуулах</TabsTrigger>
          <TabsTrigger value="url">URL оруулах</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <BunnyVideoUploader
            lessonVideoId={lessonVideoId}
            onVideoReady={handleVideoReady}
            onVideoRemoved={handleVideoRemoved}
            label={label}
          />
        </TabsContent>

        <TabsContent value="url" className="mt-4">
          <VideoUrlInputControlled
            value={videoUrl || ""}
            onChange={handleUrlChange}
            label={label}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
