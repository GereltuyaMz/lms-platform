"use client";

import { FileText, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

type Resource = {
  name: string;
  size: string;
  url: string;
};

type LessonContentProps = {
  overview: string;
  resources: Resource[];
};

export const LessonContent = ({ overview, resources }: LessonContentProps) => {
  return (
    <div className="bg-white rounded-lg border">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
          >
            📝 Overview
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
          >
            📄 Resources
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="p-6">
          <h3 className="text-lg font-semibold mb-3">Lesson Overview</h3>
          <p className="text-regular text-muted-foreground mb-6">{overview}</p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Key Takeaways:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Understand the fundamental concepts of geometry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>
                    Learn about essential geometry tools and their uses
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Practice basic measurement techniques</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="p-6">
          <h3 className="text-lg font-semibold mb-3">Downloadable Resources</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Download these materials to help you learn and practice
          </p>

          <div className="space-y-3">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{resource.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {resource.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
