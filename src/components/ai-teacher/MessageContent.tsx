"use client";

import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

type MessageContentProps = {
  content: string;
};

export const MessageContent = ({ content }: MessageContentProps) => {
  // Parse content to identify LaTeX blocks and inline math
  const parseContent = (text: string) => {
    const parts: React.JSX.Element[] = [];
    let currentIndex = 0;
    let key = 0;

    // Combined regex to match all math in order: $$ ... $$, \[ ... \], $ ... $, \( ... \)
    const mathRegex = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$(.+?)\$|\\\((.+?)\\\)/g;

    const segments: Array<{
      type: "text" | "block" | "inline";
      content: string;
      start: number;
      end: number;
    }> = [];

    let match: RegExpExecArray | null;

    while ((match = mathRegex.exec(text)) !== null) {
      const isBlock = match[1] !== undefined || match[2] !== undefined;
      const latex = match[1] || match[2] || match[3] || match[4];

      segments.push({
        type: isBlock ? "block" : "inline",
        content: latex,
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    // Build the final JSX
    segments.forEach((segment) => {
      // Add text before this segment
      if (segment.start > currentIndex) {
        const textContent = text.slice(currentIndex, segment.start);
        if (textContent) {
          parts.push(<span key={`text-${key++}`}>{textContent}</span>);
        }
      }

      // Add the math segment
      // Convert long inline math to block for better display
      const isLongFormula = segment.content.length > 40;

      if (segment.type === "block" || isLongFormula) {
        parts.push(
          <div key={`block-${key++}`} className="my-2 overflow-x-auto max-w-full">
            <BlockMath math={segment.content.trim()} />
          </div>
        );
      } else {
        parts.push(
          <span key={`inline-${key++}`} className="inline-block max-w-full overflow-x-auto">
            <InlineMath math={segment.content.trim()} />
          </span>
        );
      }

      currentIndex = segment.end;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      const remaining = text.slice(currentIndex);
      if (remaining) {
        parts.push(<span key={`text-${key++}`}>{remaining}</span>);
      }
    }

    return parts.length > 0 ? parts : [<span key="default">{text}</span>];
  };

  return (
    <div className="whitespace-pre-line break-words overflow-hidden">
      {parseContent(content)}
    </div>
  );
};
