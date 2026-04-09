"use client";

import { useRef, useState } from "react";
import { adminUploadImage } from "@/lib/api";
import { PixelButton } from "@/components/pixel";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await adminUploadImage(file);
      onUpload(data.url);
    } catch {
      alert("上传失败");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      <PixelButton
        variant="secondary"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "上传中..." : "📷 上传图片"}
      </PixelButton>
    </>
  );
}
