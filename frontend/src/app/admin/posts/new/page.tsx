"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreatePost, getCategories, getTags } from "@/lib/api";
import { Category, Tag } from "@/types";
import { PixelButton, PixelInput, PixelSelect, PixelToggle, PixelTag } from "@/components/pixel";
import { PixelTextarea } from "@/components/pixel/PixelInput";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import ImageUploader from "@/components/admin/ImageUploader";

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getTags().then(setAllTags).catch(() => {});
  }, []);

  useEffect(() => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generated);
  }, [title]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await adminCreatePost({
        title,
        slug,
        excerpt,
        content,
        cover_image: coverImage,
        category_id: categoryId ? Number(categoryId) : null,
        tag_ids: selectedTagIds,
        is_published: isPublished,
      });
      router.push("/admin/posts");
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <h1 className="font-pixel text-sm mb-4">✏️ 新建文章</h1>
      <div className="flex flex-col gap-4">
        <PixelInput label="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
        <PixelInput label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <PixelTextarea label="摘要" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />

        <PixelSelect
          label="分类"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={[
            { value: "", label: "-- 无分类 --" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        <div>
          <label className="font-pixel text-xs text-text-secondary block mb-1">标签</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <PixelTag
                key={tag.id}
                color={tag.color}
                onClick={() => toggleTag(tag.id)}
                className={selectedTagIds.includes(tag.id) ? "ring-2 ring-primary" : "opacity-60"}
              >
                {tag.name}
              </PixelTag>
            ))}
          </div>
        </div>

        <div>
          <label className="font-pixel text-xs text-text-secondary block mb-1">封面图</label>
          <div className="flex items-center gap-3">
            <ImageUploader onUpload={setCoverImage} />
            {coverImage && (
              <img src={coverImage} alt="Cover" className="h-12 pixel-border" />
            )}
          </div>
        </div>

        <PixelToggle checked={isPublished} onChange={setIsPublished} label="发布" />

        <MarkdownEditor value={content} onChange={setContent} />

        <div className="flex gap-3">
          <PixelButton onClick={handleSubmit} disabled={saving}>
            {saving ? "保存中..." : isPublished ? "发布" : "保存草稿"}
          </PixelButton>
          <PixelButton variant="secondary" onClick={() => router.back()}>
            取消
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
