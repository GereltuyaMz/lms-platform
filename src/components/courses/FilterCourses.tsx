"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Category } from "@/types/database";

type FilterCoursesProps = {
  categories: Category[];
  onFilterChange?: (filters: FilterState) => void;
  totalCourses?: number;
  filteredCount?: number;
  initialFilters?: FilterState;
};

export type FilterState = {
  topics: string[];
  level: string;
};

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export const FilterCourses = ({
  categories,
  onFilterChange,
  totalCourses = 0,
  filteredCount = 0,
  initialFilters,
}: FilterCoursesProps) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    initialFilters?.topics || []
  );
  const [selectedLevel, setSelectedLevel] = useState<string>(
    initialFilters?.level || "All"
  );

  // Sync with parent filters when they change (e.g., from URL)
  useEffect(() => {
    if (initialFilters) {
      setSelectedTopics(initialFilters.topics);
      setSelectedLevel(initialFilters.level);
    }
  }, [initialFilters]);

  const handleTopicChange = (topic: string, checked: boolean) => {
    const newTopics = checked
      ? [...selectedTopics, topic]
      : selectedTopics.filter((selectedTopic) => selectedTopic !== topic);

    setSelectedTopics(newTopics);
    onFilterChange?.({ topics: newTopics, level: selectedLevel });
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    onFilterChange?.({ topics: selectedTopics, level });
  };

  const handleClearTopic = () => {
    setSelectedTopics([]);
    onFilterChange?.({ topics: [], level: selectedLevel });
  };

  const handleClearLevel = () => {
    setSelectedLevel("All");
    onFilterChange?.({ topics: selectedTopics, level: "All" });
  };

  const handleClearAll = () => {
    setSelectedTopics([]);
    setSelectedLevel("All");
    onFilterChange?.({ topics: [], level: "All" });
  };

  return (
    <div className="w-full space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">Filters</h2>
        <Button
          variant="ghost"
          onClick={handleClearAll}
          className="cursor-pointer text-sm  hover:bg-transparent hover:underline"
        >
          Clear all
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCourses}
      </div>

      <div className="space-y-3 border-t pt-4 md:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold md:text-base">Topic</h3>
          <Button
            variant="ghost"
            onClick={handleClearTopic}
            className="cursor-pointer text-sm hover:bg-transparent hover:underline"
          >
            Clear
          </Button>
        </div>

        <div className="space-y-2.5 md:space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.slug}
                checked={selectedTopics.includes(category.name)}
                onCheckedChange={(checked) =>
                  handleTopicChange(category.name, checked as boolean)
                }
                className="cursor-pointer"
              />
              <Label
                htmlFor={category.slug}
                className="cursor-pointer text-regular peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t pt-4 md:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold md:text-base">Level</h3>
          <Button
            variant="ghost"
            onClick={handleClearLevel}
            className="cursor-pointer text-sm hover:bg-transparent hover:underline"
          >
            Clear
          </Button>
        </div>

        <RadioGroup value={selectedLevel} onValueChange={handleLevelChange}>
          <div className="space-y-2.5 md:space-y-3">
            {levels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <RadioGroupItem value={level} id={level} className="cursor-pointer" />
                <Label
                  htmlFor={level}
                  className="cursor-pointer text-regular peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
