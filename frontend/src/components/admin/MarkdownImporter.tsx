"use client";

import { useEffect, useRef, useState } from "react";
import { adminUploadImage } from "@/lib/api";
import { PixelButton } from "@/components/pixel";

interface MarkdownImporterProps {
  onImport: (content: string) => void;
}

type BrowserFile = File & {
  webkitRelativePath?: string;
};

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

function normalizePath(path: string) {
  return path.replace(/\\/g, "/").replace(/^\.\//, "").toLowerCase();
}

function getPathCandidates(path: string) {
  const normalized = normalizePath(path);
  const segments = normalized.split("/").filter(Boolean);
  const candidates = new Set<string>([normalized]);

  for (let i = 1; i < segments.length; i += 1) {
    candidates.add(segments.slice(i).join("/"));
  }

  if (segments.length > 0) {
    candidates.add(segments[segments.length - 1]);
  }

  return Array.from(candidates);
}

function findMatchingFile(imagePath: string, files: BrowserFile[]) {
  const candidates = getPathCandidates(imagePath);

  return files.find((file) => {
    const relativePath = normalizePath(file.webkitRelativePath || "");
    const fileName = normalizePath(file.name);

    return candidates.some(
      (candidate) =>
        candidate === relativePath ||
        candidate === fileName ||
        (relativePath !== "" && relativePath.endsWith(`/${candidate}`))
    );
  });
}

export default function MarkdownImporter({ onImport }: MarkdownImporterProps) {
  const mdInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [mdContent, setMdContent] = useState<string | null>(null);
  const [pendingImages, setPendingImages] = useState<string[]>([]);

  useEffect(() => {
    const input = imgInputRef.current;
    if (!input) return;

    input.setAttribute("webkitdirectory", "");
    input.setAttribute("directory", "");
  }, []);

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
      const fileArray = Array.from(files) as BrowserFile[];
      const missingImages: string[] = [];

      for (const imagePath of pendingImages) {
        const matched = findMatchingFile(imagePath, fileArray);

        if (matched) {
          try {
            const data = await adminUploadImage(matched);
            content = content.split(imagePath).join(data.url);
          } catch {
            missingImages.push(imagePath);
          }
        } else {
          missingImages.push(imagePath);
        }
      }

      if (missingImages.length > 0) {
        alert(`以下图片未成功匹配或上传，将保留原路径：\n${missingImages.join("\n")}`);
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
              {importing ? "上传中..." : "选择图片或图片目录"}
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
