"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Sparkles,
  HelpCircle,
  Brain,
  Maximize2,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  sendChatMessage,
  getChatHistory,
  getChatSession,
  validateAnswer,
} from "@/lib/actions/ai-chat-actions";
import type { ChatMessage, LessonStep, MessageType } from "@/types/ai-chat";
import { toast } from "sonner";
import { MessageContent } from "./MessageContent";

type AIChatWidgetProps = {
  lessonId: string;
  lessonStep: LessonStep;
  lessonTitle: string;
  lessonContent?: string;
};

export const AIChatWidget = ({
  lessonId,
  lessonStep,
  lessonTitle,
  lessonContent,
}: AIChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<MessageType | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !sessionId) {
      loadChatSession();
    }
  }, [isOpen]);

  const loadChatSession = async () => {
    const result = await getChatSession(lessonId, lessonStep);
    if (result.success && result.sessionId) {
      setSessionId(result.sessionId);
      loadChatHistory(result.sessionId);
    } else {
      toast.error("Чатын сешн ачааллахад алдаа гарлаа");
    }
  };

  const loadChatHistory = async (sid: string) => {
    const result = await getChatHistory(sid);
    if (result.success) {
      setMessages(result.messages);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
      }
    }, 100);
  };

  // Scroll to bottom when chat is opened or messages change
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom();
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (messageType: MessageType = "general") => {
    if (!inputMessage.trim() || isLoading || !sessionId) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);
    setActiveMode(messageType);

    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessage,
      message_type: messageType,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    scrollToBottom();

    try {
      const result = await sendChatMessage({
        lessonId,
        lessonStep,
        message: userMessage,
        messageType,
        lessonContext: {
          title: lessonTitle,
          content: lessonContent,
        },
      });

      if (result.success && result.response) {
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));

        await loadChatHistory(sessionId);
        scrollToBottom();
      } else {
        toast.error(result.error || "Мессеж илгээхэд алдаа гарлаа");
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Мессеж илгээхэд алдаа гарлаа");
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setIsLoading(false);
      setActiveMode(null);
    }
  };

  const handleValidateAnswer = async (messageId: string) => {
    if (!answerInput.trim() || !sessionId) return;

    setIsLoading(true);
    try {
      const result = await validateAnswer({
        sessionId,
        messageId,
        userAnswer: answerInput.trim(),
      });

      if (result.success) {
        setAnswerInput("");
        await loadChatHistory(sessionId);
        scrollToBottom();

        if (result.isCorrect) {
          toast.success("Зөв!");
        } else {
          toast.error("Буруу байна. Тайлбарыг харна уу.");
        }
      } else {
        toast.error(result.error || "Хариулт шалгахад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error validating answer:", error);
      toast.error("Хариулт шалгахад алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === "user";

    return (
      <div
        key={message.id}
        className={cn("mb-2 flex", isUser ? "justify-end" : "justify-start")}
      >
        <div
          className={cn(
            "max-w-[85%] rounded-2xl px-2.5 py-1.5 shadow-sm",
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-muted text-foreground"
          )}
        >
          <div className="text-[13px] leading-[1.4]">
            <MessageContent content={message.content} />
          </div>

          {!isUser && message.generated_problem && (
            <div className="mt-2 p-2.5 bg-background/50 rounded-xl border border-border/50 backdrop-blur-sm">
              <p className="font-semibold text-xs mb-1.5">
                {message.generated_problem.question}
              </p>

              {message.generated_problem.options && (
                <div className="space-y-1 mt-2">
                  {message.generated_problem.options.map((option, idx) => (
                    <div key={idx} className="text-xs px-2 py-1 bg-background/50 rounded-lg">
                      {String.fromCharCode(65 + idx)}. {option}
                    </div>
                  ))}
                </div>
              )}

              {!message.user_answer && (
                <div className="mt-2 flex gap-1.5">
                  <Input
                    placeholder="Хариулт..."
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleValidateAnswer(message.id);
                      }
                    }}
                    disabled={isLoading}
                    className="h-8 text-xs"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleValidateAnswer(message.id)}
                    disabled={isLoading || !answerInput.trim()}
                    className="h-8 px-3 text-xs"
                  >
                    Шалгах
                  </Button>
                </div>
              )}

              {message.user_answer && (
                <div className="mt-2 text-xs px-2 py-1.5 bg-background/70 rounded-lg">
                  <p>
                    Таны хариулт: <strong>{message.user_answer}</strong>
                    <span className={cn("ml-1", message.is_correct ? "text-green-600" : "text-red-600")}>
                      {message.is_correct ? "✓" : "✗"}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          <span className="text-[10px] opacity-60 mt-1 block">
            {new Date(message.created_at).toLocaleTimeString("mn-MN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed z-50 shadow-2xl flex flex-col overflow-hidden bg-background transition-all duration-300",
      isFullscreen
        ? "inset-4 rounded-2xl"
        : "bottom-4 right-4 w-[420px] h-[650px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] rounded-3xl"
    )}>
      {/* Compact header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[13px]">AI Багш</h3>
            <p className="text-[11px] opacity-80">Онлайн</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 rounded-full hover:bg-white/15 transition-colors flex items-center justify-center"
            title={isFullscreen ? "Хэвийн харагдац" : "Бүтэн дэлгэц"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-full hover:bg-white/15 transition-colors flex items-center justify-center"
            title="Хаах"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Ultra-compact action chips */}
      <div className="flex gap-1 p-2 border-b bg-muted/20">
        <button
          onClick={() => {
            setInputMessage("Энэ бодлогыг шийдэхэд минь туслаарай");
            setActiveMode("solve");
          }}
          disabled={isLoading}
          className="flex-1 px-2 py-1 rounded-full border text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-accent transition-colors disabled:opacity-50"
        >
          <HelpCircle className="h-3 w-3" />
          Шийдэх
        </button>
        <button
          onClick={() => {
            setInputMessage("Энэ ойлголтыг тайлбарлаж өгнө үү");
            setActiveMode("explain");
          }}
          disabled={isLoading}
          className="flex-1 px-2 py-1 rounded-full border text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-accent transition-colors disabled:opacity-50"
        >
          <Brain className="h-3 w-3" />
          Тайлбар
        </button>
        <button
          onClick={() => {
            setInputMessage("Надад дадлага бодлого үүсгэж өгнө үү");
            handleSendMessage("generate_problem");
          }}
          disabled={isLoading}
          className="flex-1 px-2 py-1 rounded-full border text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-accent transition-colors disabled:opacity-50"
        >
          <Sparkles className="h-3 w-3" />
          Дадлага
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        <div
          ref={scrollViewportRef}
          className="h-full overflow-y-auto p-2.5"
        >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 flex items-center justify-center mb-2">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground/80">
              Сайн уу! Би таны AI багш.<br />Асуулт асуугаарай!
            </p>
          </div>
        ) : (
          messages.map(renderMessage)
        )}

        {isLoading && (
          <div className="flex justify-start mb-2">
            <div className="bg-muted rounded-2xl px-3 py-1.5">
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1 h-1 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1 h-1 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Compact input area */}
      <div className="p-2.5 border-t">
        <div className="flex gap-1.5 items-center bg-muted/30 rounded-full px-3 py-1.5">
          <input
            type="text"
            placeholder="Мессеж бичих..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(activeMode || "general");
              }
            }}
            disabled={isLoading}
            className="flex-1 bg-transparent text-[13px] focus:outline-none disabled:opacity-50 placeholder:text-muted-foreground/60"
          />
          <button
            onClick={() => handleSendMessage(activeMode || "general")}
            disabled={isLoading || !inputMessage.trim()}
            className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <Send className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
