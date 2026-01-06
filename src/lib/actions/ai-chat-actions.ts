"use server";

import { getAuthenticatedUser } from "./helpers";
import type {
  ChatMessage,
  SendMessageParams,
  ValidateAnswerParams,
  LessonStep,
} from "@/types/ai-chat";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-4o-mini";

type ChatSessionResult = {
  success: boolean;
  sessionId: string | null;
  error: string | null;
};

type ChatHistoryResult = {
  success: boolean;
  messages: ChatMessage[];
  error: string | null;
};

type SendMessageResult = {
  success: boolean;
  response: {
    id: string;
    content: string;
    generatedProblem?: unknown;
  } | null;
  error: string | null;
};

type ValidateAnswerResult = {
  success: boolean;
  isCorrect: boolean;
  explanation?: string;
  correctAnswer?: string;
  error: string | null;
};

/**
 * Get or create chat session for current user and lesson
 */
export async function getChatSession(
  lessonId: string,
  lessonStep: LessonStep
): Promise<ChatSessionResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return { success: false, error: "Not authenticated", sessionId: null };
    }

    const { data, error } = await supabase.rpc("get_or_create_chat_session", {
      p_user_id: user.id,
      p_lesson_id: lessonId,
      p_lesson_step: lessonStep,
    });

    if (error) {
      console.error("Error getting chat session:", error);
      return {
        success: false,
        error: "Failed to get chat session",
        sessionId: null,
      };
    }

    return { success: true, sessionId: data as string, error: null };
  } catch (error) {
    console.error("Error in getChatSession:", error);
    return {
      success: false,
      sessionId: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get chat history for a session
 */
export async function getChatHistory(
  sessionId: string
): Promise<ChatHistoryResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return { success: false, messages: [], error: "Not authenticated" };
    }

    const { data, error } = await supabase.rpc("get_chat_history", {
      p_session_id: sessionId,
      p_limit: 50,
    });

    if (error) {
      console.error("Error getting chat history:", error);
      return {
        success: false,
        messages: [],
        error: "Failed to get chat history",
      };
    }

    return {
      success: true,
      messages: (data || []).map((msg: Record<string, unknown>) => ({
        id: msg.message_id as string,
        role: msg.role as ChatMessage["role"],
        content: msg.content as string,
        message_type: msg.message_type as ChatMessage["message_type"],
        generated_problem: msg.generated_problem as ChatMessage["generated_problem"],
        user_answer: msg.user_answer as ChatMessage["user_answer"],
        is_correct: msg.is_correct as ChatMessage["is_correct"],
        created_at: msg.created_at as string,
      })),
      error: null,
    };
  } catch (error) {
    console.error("Error in getChatHistory:", error);
    return {
      success: false,
      messages: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send message to AI teacher and get response
 */
export async function sendChatMessage(
  params: SendMessageParams
): Promise<SendMessageResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return { success: false, error: "Not authenticated", response: null };
    }

    const sessionResult = await getChatSession(
      params.lessonId,
      params.lessonStep
    );
    if (!sessionResult.success || !sessionResult.sessionId) {
      return { success: false, error: "Failed to create session", response: null };
    }

    const sessionId = sessionResult.sessionId;

    const historyResult = await getChatHistory(sessionId);
    const chatHistory = historyResult.success ? historyResult.messages : [];

    const { error: userMsgError } = await supabase
      .from("ai_chat_messages")
      .insert({
        session_id: sessionId,
        role: "user",
        content: params.message,
        message_type: params.messageType,
      });

    if (userMsgError) {
      console.error("Error saving user message:", userMsgError);
      return { success: false, error: "Failed to save message", response: null };
    }

    const aiResponse = await callOpenAI(
      params.message,
      params.messageType,
      params.lessonContext,
      chatHistory
    );

    if (!aiResponse.success) {
      return { success: false, error: aiResponse.error, response: null };
    }

    const { data: assistantMsg, error: assistantMsgError } = await supabase
      .from("ai_chat_messages")
      .insert({
        session_id: sessionId,
        role: "assistant",
        content: aiResponse.content!,
        message_type: params.messageType,
        generated_problem: aiResponse.generatedProblem || null,
      })
      .select()
      .single();

    if (assistantMsgError) {
      console.error("Error saving assistant message:", assistantMsgError);
      return {
        success: false,
        error: "Failed to save response",
        response: null,
      };
    }

    return {
      success: true,
      response: {
        id: assistantMsg.id,
        content: aiResponse.content!,
        generatedProblem: aiResponse.generatedProblem,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error in sendChatMessage:", error);
    return {
      success: false,
      response: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Validate user's answer to generated problem
 */
export async function validateAnswer(
  params: ValidateAnswerParams
): Promise<ValidateAnswerResult> {
  try {
    const { user, supabase, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return { success: false, error: "Not authenticated", isCorrect: false };
    }

    const { data: message, error: msgError } = await supabase
      .from("ai_chat_messages")
      .select("generated_problem")
      .eq("id", params.messageId)
      .single();

    if (msgError || !message?.generated_problem) {
      return { success: false, error: "Problem not found", isCorrect: false };
    }

    const problem = message.generated_problem as Record<string, string>;
    const isCorrect =
      params.userAnswer.trim().toLowerCase() ===
      problem.correctAnswer.trim().toLowerCase();

    const { error: updateError } = await supabase
      .from("ai_chat_messages")
      .update({
        user_answer: params.userAnswer,
        is_correct: isCorrect,
      })
      .eq("id", params.messageId);

    if (updateError) {
      console.error("Error updating answer:", updateError);
      return { success: false, error: "Failed to save answer", isCorrect: false };
    }

    const feedbackContent = isCorrect
      ? `Зөв! ${problem.explanation}`
      : `Буруу. Зөв хариулт: ${problem.correctAnswer}. ${problem.explanation}`;

    await supabase.from("ai_chat_messages").insert({
      session_id: params.sessionId,
      role: "assistant",
      content: feedbackContent,
      message_type: "general",
    });

    return {
      success: true,
      isCorrect,
      explanation: problem.explanation,
      correctAnswer: problem.correctAnswer,
      error: null,
    };
  } catch (error) {
    console.error("Error in validateAnswer:", error);
    return {
      success: false,
      isCorrect: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Call OpenAI API with context
 */
async function callOpenAI(
  userMessage: string,
  messageType: string,
  lessonContext?: SendMessageParams["lessonContext"],
  chatHistory: ChatMessage[] = []
): Promise<{
  success: boolean;
  error: string | null;
  content: string | null;
  generatedProblem?: unknown;
}> {
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      error: "OpenAI API key not configured",
      content: null,
    };
  }

  try {
    const systemPrompt = buildSystemPrompt(messageType, lessonContext);

    const messages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    const recentHistory = chatHistory.slice(-10);
    recentHistory.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    messages.push({ role: "user", content: userMessage });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        temperature: messageType === "generate_problem" ? 0.8 : 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return { success: false, error: "AI service error", content: null };
    }

    const data = await response.json();
    const aiContent = data.choices[0]?.message?.content;

    if (!aiContent) {
      return { success: false, error: "Empty AI response", content: null };
    }

    let generatedProblem = null;
    if (messageType === "generate_problem") {
      try {
        generatedProblem = JSON.parse(aiContent);
      } catch {
        console.warn("Failed to parse generated problem JSON");
      }
    }

    return {
      success: true,
      content: generatedProblem
        ? JSON.stringify(generatedProblem, null, 2)
        : aiContent,
      generatedProblem,
      error: null,
    };
  } catch (error) {
    console.error("OpenAI call error:", error);
    return {
      success: false,
      error: "Failed to contact AI service",
      content: null,
    };
  }
}

/**
 * Build system prompt based on message type and context
 */
function buildSystemPrompt(
  messageType: string,
  lessonContext?: SendMessageParams["lessonContext"]
): string {
  const basePrompt = `Та оюутнуудад хичээлээ судлахад тусалдаг мэргэжлийн AI багш юм. Та тэвчээртэй, урам өгдөг бөгөөд тодорхой тайлбар өгдөг. Үргэлж монгол хэлээр хариулна уу.`;

  const topicBoundaries = lessonContext
    ? `\n\n⚠️ ХАРИУ ӨГӨХ ХҮРЭЭ:
✅ Зөвшөөрөгдсөн асуултууд:
- "${lessonContext.title}" хичээлийн агуулгатай шууд холбоотой асуулт
- Хичээлтэй холбогдох ойлголт, онол, математикийн асуудал
- Суралцах арга барил, дадлага хийх зөвлөмж
- Энэ хичээлийн хүрээнд багтсан боловсролын асуулт

❌ Зөвшөөрөөгүй асуултууд:
- Хичээлтэй огт холбоогүй ярилцлага (цаг агаар, спорт, зугаа цэнгэл гэх мэт)
- Хувийн зөвлөгөө, амьдралын асуудал
- Өөр хичээл эсвэл салбарын асуулт (энэ хичээлд хамааралгүй)

Хэрэв оюутан зөвшөөрөөгүй сэдвээр асуулт асуувал, эелдэг байдлаар дараах маягаар чиглүүлнэ:
"Би танд '${lessonContext.title}' хичээлийн талаар тусалж чадна. Энэ хичээлтэй холбоотой ямар нэг зүйл ойлгох шаардлагатай байна уу? 😊"`
    : "";

  const contextInfo = lessonContext
    ? `\n\nОдоогийн хичээл: "${lessonContext.title}"\n${lessonContext.content ? `Хичээлийн агуулгын товч: ${lessonContext.content.substring(0, 500)}` : ""}`
    : "";

  switch (messageType) {
    case "solve":
      return `${basePrompt}${topicBoundaries}${contextInfo}\n\nТаны үүрэг: Оюутанд асуудлыг алхам алхмаар шийдэхэд нь туслах. Нарийн асуудлыг илүү энгийн алхмуудад хувааж өг. Бүрэн хариултыг шууд өгөхгүй байж удирдан зааж өг.`;

    case "explain":
      return `${basePrompt}${topicBoundaries}${contextInfo}\n\nТаны үүрэг: Ойлголтыг тодорхой бөгөөд хялбар байдлаар тайлбарлах. Шаардлагатай бол зүйрлэл болон жишээ ашигла. Оюутан ойлгосон эсэхийг шалгаж явах.`;

    case "generate_problem":
      return `${basePrompt}${topicBoundaries}${contextInfo}\n\nТаны үүрэг: Хичээлийн агуулгад үндэслэн дадлага бодлого үүсгэх. Яг энэ бүтэцтэй JSON объект буцаана уу:
{
  "question": "Монгол хэл дээрх бодлогын тодорхойлолт",
  "correctAnswer": "Зөв хариулт",
  "options": ["Хувилбар А", "Хувилбар Б", "Хувилбар В", "Хувилбар Г"],
  "explanation": "Монгол хэл дээрх дэлгэрэнгүй тайлбар",
  "difficulty": "easy|medium|hard"
}

Бодлогыг хичээлд нийцүүлж, оюутны түвшинд тохирсон байлгаарай.`;

    default:
      return `${basePrompt}${topicBoundaries}${contextInfo}\n\nТаны үүрэг: Оюутны асуултад тустай хариулж, сурах хүслийг нь дэмжих.`;
  }
}
