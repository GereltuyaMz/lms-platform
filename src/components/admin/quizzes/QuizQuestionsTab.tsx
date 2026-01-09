"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createQuizQuestionWithOptions,
  updateQuizQuestion,
  deleteQuizQuestion,
  createQuizOption,
  deleteQuizOption,
  setQuizCorrectOption,
  type QuestionWithOptions,
} from "@/lib/actions/admin/quizzes";
import { QuizQuestionItem } from "./QuizQuestionItem";
import { NewQuestionForm } from "./NewQuestionForm";
import { DeleteQuestionDialog } from "./DeleteQuestionDialog";

type QuizQuestionsTabProps = {
  quizId: string;
  initialQuestions: QuestionWithOptions[];
};

export const QuizQuestionsTab = ({
  quizId,
  initialQuestions,
}: QuizQuestionsTabProps) => {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddQuestion = async (data: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }): Promise<boolean> => {
    if (!data.question.trim()) {
      toast.error("Асуулт оруулна уу");
      return false;
    }

    const filledOptions = data.options.filter((o) => o.trim());
    if (filledOptions.length < 2) {
      toast.error("Хамгийн багадаа 2 хариулт оруулна уу");
      return false;
    }

    if (!data.options[data.correctIndex]?.trim()) {
      toast.error("Зөв хариултыг сонгоно уу");
      return false;
    }

    setIsSubmitting(true);
    const result = await createQuizQuestionWithOptions(quizId, {
      question: data.question,
      explanation: data.explanation,
      options: data.options,
      correctIndex: data.correctIndex,
      order_index: questions.length,
    });

    if (result.success && result.data) {
      setQuestions([...questions, result.data]);
      toast.success(result.message);
      router.refresh();
      setIsSubmitting(false);
      return true;
    } else {
      toast.error(result.message);
      setIsSubmitting(false);
      return false;
    }
  };

  const handleUpdateQuestion = async (
    id: string,
    data: { question: string; explanation: string; points: number }
  ) => {
    setIsSubmitting(true);
    const q = questions.find((q) => q.id === id);
    if (!q) return;
    const result = await updateQuizQuestion(id, {
      ...data,
      order_index: q.order_index,
    });
    if (result.success) {
      setQuestions(questions.map((q) => (q.id === id ? { ...q, ...data } : q)));
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteQuestion = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    const result = await deleteQuizQuestion(deleteId);
    if (result.success) {
      setQuestions(questions.filter((q) => q.id !== deleteId));
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
    setDeleteId(null);
  };

  const handleAddOption = async (questionId: string, text: string) => {
    setIsSubmitting(true);
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;
    const result = await createQuizOption(questionId, {
      option_text: text,
      is_correct: question.options.length === 0,
      order_index: question.options.length,
    });
    if (result.success && result.data) {
      setQuestions(
        questions.map((q) =>
          q.id === questionId
            ? { ...q, options: [...q.options, result.data!] }
            : q
        )
      );
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteOption = async (questionId: string, optionId: string) => {
    setIsSubmitting(true);
    const result = await deleteQuizOption(optionId);
    if (result.success) {
      setQuestions(
        questions.map((q) =>
          q.id === questionId
            ? { ...q, options: q.options.filter((o) => o.id !== optionId) }
            : q
        )
      );
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleSetCorrect = async (questionId: string, optionId: string) => {
    setIsSubmitting(true);
    const result = await setQuizCorrectOption(questionId, optionId);
    if (result.success) {
      setQuestions(
        questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.map((o) => ({
                  ...o,
                  is_correct: o.id === optionId,
                })),
              }
            : q
        )
      );
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuizQuestionItem
            key={question.id}
            question={question}
            index={index}
            onUpdate={handleUpdateQuestion}
            onDelete={setDeleteId}
            onAddOption={handleAddOption}
            onDeleteOption={handleDeleteOption}
            onSetCorrect={handleSetCorrect}
            isSubmitting={isSubmitting}
          />
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Асуулт байхгүй байна. Эхний асуултаа нэмнэ үү.
        </div>
      )}

      <NewQuestionForm onSubmit={handleAddQuestion} isSubmitting={isSubmitting} />

      <DeleteQuestionDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDeleteQuestion}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
