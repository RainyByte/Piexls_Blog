"use client";

import { useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { ICommand } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { adminUploadImage } from "@/lib/api";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const uploadingRef = useRef(false);

  const uploadAndInsert = useCallback(
    async (file: File, replaceSelection: (text: string) => void) => {
      if (uploadingRef.current) return;
      uploadingRef.current = true;
      replaceSelection(`![uploading...]()`);
      try {
        const data = await adminUploadImage(file);
        // Replace the placeholder with the actual URL
        const placeholder = `![uploading...]()`;
        const replacement = `![${file.name}](${data.url})`;
        onChange(value.replace(placeholder, replacement));
      } catch {
        onChange(value.replace(`![uploading...]()`, ""));
        alert("图片上传失败");
      } finally {
        uploadingRef.current = false;
      }
    },
    [value, onChange]
  );

  // Custom toolbar command: upload image via file picker
  const imageUploadCommand: ICommand = {
    name: "upload-image",
    keyCommand: "upload-image",
    buttonProps: { "aria-label": "上传图片", title: "上传图片" },
    icon: (
      <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
        <path d="M0 4a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2 0v8l4-3 3 2 5-4 4 3V4H2zm0 12h16v-1l-4-3-5 4-3-2-4 3v-1zm11-8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
    execute: (_state, api) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        uploadAndInsert(file, (text) => api.replaceSelection(text));
      };
      input.click();
    },
  };

  // Handle paste: intercept images pasted from clipboard
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;
          if (uploadingRef.current) return;
          uploadingRef.current = true;
          try {
            const data = await adminUploadImage(file);
            onChange(value + `\n![image](${data.url})\n`);
          } catch {
            alert("图片上传失败");
          } finally {
            uploadingRef.current = false;
          }
          return;
        }
      }
    },
    [value, onChange]
  );

  // Handle drop: intercept dropped image files
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      const files = e.dataTransfer?.files;
      if (!files) return;

      for (const file of Array.from(files)) {
        if (file.type.startsWith("image/")) {
          e.preventDefault();
          if (uploadingRef.current) return;
          uploadingRef.current = true;
          try {
            const data = await adminUploadImage(file);
            onChange(value + `\n![${file.name}](${data.url})\n`);
          } catch {
            alert("图片上传失败");
          } finally {
            uploadingRef.current = false;
          }
          return;
        }
      }
    },
    [value, onChange]
  );

  return (
    <div
      data-color-mode="auto"
      className="pixel-border"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <MDEditor
        value={value}
        onChange={(v) => onChange(v || "")}
        height={500}
        preview="live"
        extraCommands={[imageUploadCommand]}
      />
    </div>
  );
}
