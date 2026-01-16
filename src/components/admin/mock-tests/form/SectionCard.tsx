"use client";

import { useState } from "react";
import { ChevronDown, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ProblemCard } from "./ProblemCard";
import type { SectionFormData, ProblemFormData } from "@/types/admin/mock-tests";
import { getDefaultProblem } from "@/types/admin/mock-tests";

type SectionCardProps = {
  section: SectionFormData;
  sectionIndex: number;
  onUpdate: (field: keyof SectionFormData, value: string | number | ProblemFormData[]) => void;
  onDelete: () => void;
  canDelete: boolean;
  storagePath: string;
};

export const SectionCard = ({
  section,
  sectionIndex,
  onUpdate,
  onDelete,
  canDelete,
  storagePath,
}: SectionCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const subjectTitles: Record<string, string> = {
    math: "Математик",
    physics: "Физик",
    chemistry: "Хими",
    english: "Англи хэл",
  };

  const handleProblemUpdate = (
    problemIndex: number,
    field: keyof ProblemFormData,
    value: unknown
  ) => {
    const updatedProblems = [...section.problems];
    updatedProblems[problemIndex] = {
      ...updatedProblems[problemIndex],
      [field]: value as never,
    };
    onUpdate("problems", updatedProblems);
  };

  const handleAddProblem = () => {
    const nextProblemNumber = section.problems.length + 1;
    const newProblem = getDefaultProblem(
      section.problems.length,
      nextProblemNumber
    );
    onUpdate("problems", [...section.problems, newProblem]);
  };

  const handleDeleteProblem = (problemIndex: number) => {
    const updatedProblems = section.problems.filter(
      (_, idx) => idx !== problemIndex
    );
    // Reindex
    const reindexed = updatedProblems.map((p, idx) => ({
      ...p,
      order_index: idx,
      problem_number: idx + 1,
    }));
    onUpdate("problems", reindexed);
  };

  const handleSubjectChange = (newSubject: string) => {
    onUpdate("subject", newSubject);
    onUpdate("title", subjectTitles[newSubject] || "");
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-2 border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  isOpen ? "" : "-rotate-90"
                }`}
              />
              <span className="font-bold text-lg">
                Хэсэг {sectionIndex + 1}: {section.title}
              </span>
              <span className="text-sm text-gray-600 ml-2">
                ({section.problems.length} асуулт)
              </span>
            </CollapsibleTrigger>
            {canDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <Label htmlFor={`section-subject-${sectionIndex}`}>
                  Хичээл <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={section.subject}
                  onValueChange={handleSubjectChange}
                >
                  <SelectTrigger id={`section-subject-${sectionIndex}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Математик</SelectItem>
                    <SelectItem value="physics">Физик</SelectItem>
                    <SelectItem value="chemistry">Хими</SelectItem>
                    <SelectItem value="english">Англи хэл</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`section-title-${sectionIndex}`}>
                  Гарчиг <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`section-title-${sectionIndex}`}
                  value={section.title}
                  onChange={(e) => onUpdate("title", e.target.value)}
                  placeholder="Математик"
                />
              </div>
            </div>

            <div className="space-y-3 ml-4 border-l-2 border-gray-200 pl-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Асуултууд</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddProblem}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Асуулт нэмэх
                </Button>
              </div>

              {section.problems.map((problem, idx) => (
                <ProblemCard
                  key={idx}
                  problem={problem}
                  problemIndex={idx}
                  onUpdate={(field, value) =>
                    handleProblemUpdate(idx, field, value)
                  }
                  onDelete={() => handleDeleteProblem(idx)}
                  canDelete={section.problems.length > 1}
                  storagePath={`${storagePath}-sec-${sectionIndex}`}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
