"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  initialContent?: string;
  onSave: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export const RichTextEditor = ({
  initialContent = "",
  onSave,
  placeholder = "Агуулга оруулах...",
  className,
}: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none p-4 min-h-[300px]",
      },
    },
    onBlur: ({ editor }) => {
      onSave(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Холбоос оруулах:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className={cn("border border-gray-200 rounded-md overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            editor.isActive("bold") && "bg-gray-200 text-gray-900"
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            editor.isActive("italic") && "bg-gray-200 text-gray-900"
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            "h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            editor.isActive("underline") && "bg-gray-200 text-gray-900"
          )}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            editor.isActive("heading", { level: 2 }) && "bg-gray-200 text-gray-900"
          )}
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            editor.isActive("heading", { level: 3 }) && "bg-gray-200 text-gray-900"
          )}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            editor.isActive("bulletList") && "bg-gray-200 text-gray-900"
          )}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            editor.isActive("orderedList") && "bg-gray-200 text-gray-900"
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={cn(
            "h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            editor.isActive("link") && "bg-gray-200 text-gray-900"
          )}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
};
