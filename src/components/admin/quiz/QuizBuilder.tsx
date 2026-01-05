"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createOption,
  deleteOption,
  setCorrectOption,
  type QuestionWithOptions,
} from "@/lib/actions/admin/quiz";
import { QuizQuestion } from "./QuizQuestion";

type QuizBuilderProps = {
  lessonId: string;
  initialQuestions: QuestionWithOptions[];
};

export const QuizBuilder = ({ lessonId, initialQuestions }: QuizBuilderProps) => {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ question: "", explanation: "", points: 10 });

  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim()) {
      toast.error("Question text is required");
      return;
    }
    setIsSubmitting(true);
    const result = await createQuestion(lessonId, {
      question: newQuestion.question,
      explanation: newQuestion.explanation,
      points: newQuestion.points,
      order_index: questions.length,
    });
    if (result.success && result.data) {
      setQuestions([...questions, { ...result.data, options: [] }]);
      setNewQuestion({ question: "", explanation: "", points: 10 });
      toast.success("Question added");
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleUpdateQuestion = async (
    id: string,
    data: { question: string; explanation: string; points: number }
  ) => {
    setIsSubmitting(true);
    const q = questions.find((q) => q.id === id);
    if (!q) return;
    const result = await updateQuestion(id, { ...data, order_index: q.order_index });
    if (result.success) {
      setQuestions(questions.map((q) => (q.id === id ? { ...q, ...data } : q)));
      toast.success("Question updated");
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteQuestion = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    const result = await deleteQuestion(deleteId);
    if (result.success) {
      setQuestions(questions.filter((q) => q.id !== deleteId));
      toast.success("Question deleted");
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
    const result = await createOption(questionId, {
      option_text: text,
      is_correct: question.options.length === 0,
      order_index: question.options.length,
    });
    if (result.success && result.data) {
      setQuestions(
        questions.map((q) =>
          q.id === questionId ? { ...q, options: [...q.options, result.data!] } : q
        )
      );
      toast.success("Option added");
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteOption = async (questionId: string, optionId: string) => {
    setIsSubmitting(true);
    const result = await deleteOption(optionId);
    if (result.success) {
      setQuestions(
        questions.map((q) =>
          q.id === questionId ? { ...q, options: q.options.filter((o) => o.id !== optionId) } : q
        )
      );
      toast.success("Option deleted");
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleSetCorrect = async (questionId: string, optionId: string) => {
    setIsSubmitting(true);
    const result = await setCorrectOption(questionId, optionId);
    if (result.success) {
      setQuestions(
        questions.map((q) =>
          q.id === questionId
            ? { ...q, options: q.options.map((o) => ({ ...o, is_correct: o.id === optionId })) }
            : q
        )
      );
      toast.success("Correct answer set");
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuizQuestion
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

      <Card className="border-gray-200 border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Add New Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-question">Question</Label>
            <Textarea
              id="new-question"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              placeholder="Enter your question..."
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-explanation">Explanation (shown after answer)</Label>
              <Input
                id="new-explanation"
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                placeholder="Why this is the correct answer..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-points">Points</Label>
              <Input
                id="new-points"
                type="number"
                min={1}
                value={newQuestion.points}
                onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 10 })}
              />
            </div>
          </div>
          <Button onClick={handleAddQuestion} disabled={isSubmitting}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question and all its options? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuestion}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
