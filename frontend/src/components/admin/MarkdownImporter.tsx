"use client";

import { useRef, useState } from "react";
import { adminUploadImage } from "@/lib/api";
import { PixelButton } from "@/components/pixel";

interface MarkdownImporterProps {
  onImport: (content: string) => void;
}

function extractImagePaths(content: string): string[] {
  const paths: string[] = [];
  const mdRegex = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
  const htmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;

  let match;
  while ((match = mdRegex.exec(content)) !== null) {
    paths.push(match[2]);
  }
  while ((match = htmlRegex.exec(content)) !== null) {
    paths.push(match[1]);
  }

  return Array.from(new Set(paths));
}

export default function MarkdownImporter({ onImport }: MarkdownImporterProps) {
  const mdInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [mdContent, setMdContent] = useState<string | null>(null);
  const [pendingImages, setPendingImages] = useState<string[]>([]);

  const handleMdFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const content = await file.text();

    // Find local image references (skip http/https URLs)
    const allPaths = extractImagePaths(content);
    const localImages = allPaths.filter(
      (p) => !p.startsWith("http://") && !p.startsWith("https://")
    );

    if (localImages.length > 0) {
      setMdContent(content);
      setPendingImages(localImages);
    } else {
      // No local images, import directly
      onImport(content);
    }

    if (mdInputRef.current) mdInputRef.current.value = "";
  };

  const handleImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !mdContent) return;

    setImporting(true);
    try {
      let content = mdContent;
      const fileArray = Array.from(files);

      for (const imagePath of pendingImages) {
        // Match by filename (the last segment of the path)
        const fileName = imagePath.split("/").pop() || imagePath;
        const matched = fileArray.find((f) => f.name === fileName);

        if (matched) {
          try {
            const data = await adminUploadImage(matched);
            // Replace all occurrences of this path
            content = content.split(imagePath).join(data.url);
          } catch {
            console.warn(`Failed to upload: ${fileName}`);
          }
        }
      }

      onImport(content);
    } catch {
      alert("导入失败");
    } finally {
      setImporting(false);
      setMdContent(null);
      setPendingImages([]);
      if (imgInputRef.current) imgInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    // Import without images
    if (mdContent) onImport(mdContent);
    setMdContent(null);
    setPendingImages([]);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={mdInputRef}
        type="file"
        accept=".md,.markdown"
        onChange={handleMdFile}
        className="hidden"
      />
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageFiles}
        className="hidden"
      />

      {pendingImages.length === 0 ? (
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={() => mdInputRef.current?.click()}
          disabled={importing}
        >
          {importing ? "导入中..." : "📄 导入 Markdown"}
        </PixelButton>
      ) : (
        <div className="pixel-border p-3 bg-bg-secondary">
          <p className="font-pixel text-[0.55rem] mb-2">
            发现 {pendingImages.length} 张本地图片引用：
          </p>
          <ul className="text-[0.6rem] text-text-secondary mb-2 max-h-24 overflow-y-auto">
            {pendingImages.map((p, i) => (
              <li key={i} className="truncate">
                {p.split("/").pop()}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <PixelButton
              size="sm"
              onClick={() => imgInputRef.current?.click()}
              disabled={importing}
            >
              {importing ? "上传中..." : "选择图片文件"}
            </PixelButton>
            <PixelButton variant="secondary" size="sm" onClick={handleCancel}>
              跳过图片
            </PixelButton>
          </div>
        </div>
      )}
    </div>
  );
}
