"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TestDetailsCard } from "./form/TestDetailsCard";
import { SectionCard } from "./form/SectionCard";
import {
  createMockTest,
  updateMockTest,
} from "@/lib/actions/admin/mock-tests";
import type {
  MockTestFormData,
  SectionFormData,
} from "@/types/admin/mock-tests";
import {
  getDefaultMockTest,
  getDefaultSection,
  calculateTotalQuestions,
  validateFormData,
} from "@/types/admin/mock-tests";

type MockTestFormProps = {
  mockTest?: MockTestFormData | null;
};

export const MockTestForm = ({ mockTest }: MockTestFormProps) => {
  const router = useRouter();
  const isEditing = !!mockTest;

  const [formData, setFormData] = useState<MockTestFormData>(
    mockTest || getDefaultMockTest()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculate total questions whenever nested data changes
  useEffect(() => {
    const total = calculateTotalQuestions(formData);
    if (total !== formData.total_questions) {
      setFormData((prev) => ({ ...prev, total_questions: total }));
    }
  }, [formData.sections]);

  // Helper: Update nested field via path
  const updateField = (path: string[], value: unknown) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newData;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  // Section operations
  const handleAddSection = () => {
    const availableSubjects = ["math", "physics", "chemistry", "english"].filter(
      (subject) =>
        !formData.sections.some((s) => s.subject === subject)
    ) as ("math" | "physics" | "chemistry" | "english")[];

    if (availableSubjects.length === 0) {
      toast.error("Бүх хэсгийг аль хэдийн нэмсэн байна (4 хичээл)");
      return;
    }

    const newSection = getDefaultSection(
      formData.sections.length,
      availableSubjects[0]
    );

    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));

    toast.success(`${newSection.title} хэсэг нэмэгдлээ`);
  };

  const handleDeleteSection = (sectionIndex: number) => {
    const updatedSections = formData.sections.filter(
      (_, idx) => idx !== sectionIndex
    );

    // Reindex
    const reindexed = updatedSections.map((s, idx) => ({
      ...s,
      order_index: idx,
    }));

    setFormData((prev) => ({
      ...prev,
      sections: reindexed,
    }));

    toast.success("Хэсэг устгалаа");
  };

  const handleSectionUpdate = (
    sectionIndex: number,
    field: keyof SectionFormData,
    value: unknown
  ) => {
    updateField(["sections", String(sectionIndex), field], value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validation = validateFormData(formData);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = isEditing
        ? await updateMockTest(mockTest.id!, formData)
        : await createMockTest(formData);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/mock-tests");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Алдаа гарлаа");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TestDetailsCard formData={formData} onChange={updateField} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Хэсгүүд</h2>
          {formData.sections.length < 4 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSection}
            >
              <Plus className="h-4 w-4 mr-2" />
              Хэсэг нэмэх
            </Button>
          )}
        </div>

        {formData.sections.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 mb-4">
              Шалгалтад хэсэг нэмэгдээгүй байна
            </p>
            <Button type="button" variant="outline" onClick={handleAddSection}>
              <Plus className="h-4 w-4 mr-2" />
              Эхний хэсгээ нэмэх
            </Button>
          </div>
        ) : (
          formData.sections.map((section, idx) => (
            <SectionCard
              key={idx}
              section={section}
              sectionIndex={idx}
              onUpdate={(field, value) =>
                handleSectionUpdate(idx, field, value)
              }
              onDelete={() => handleDeleteSection(idx)}
              canDelete={formData.sections.length > 1}
              storagePath={`test-${formData.id || "new"}`}
            />
          ))
        )}
      </div>

      <div className="flex items-center gap-4 pt-6 border-t">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting
            ? "Хадгалж байна..."
            : isEditing
            ? "Шинэчлэх"
            : "Шалгалт үүсгэх"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/mock-tests")}
          disabled={isSubmitting}
        >
          Болих
        </Button>

        <div className="ml-auto text-sm text-gray-600">
          <span className="font-medium">{formData.total_questions}</span> нийт
          асуулт
        </div>
      </div>
    </form>
  );
};
