"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Video } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  onFileSelect: (file: File) => void;
};

export const VideoDropzone = ({ label, onFileSelect }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Video className="h-4 w-4 text-gray-500" />
        {label}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleInputChange}
          className="hidden"
        />
        <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700">Видео файл чирж оруулах</p>
        <p className="text-xs text-gray-500 mt-1">эсвэл дарж сонгоно уу</p>
        <p className="text-xs text-gray-400 mt-2">MP4, MOV, AVI • Хамгийн ихдээ 2GB</p>
      </div>
    </div>
  );
};
