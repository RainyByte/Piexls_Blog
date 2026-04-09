"use client";

import { useEffect, useState } from "react";
import { getCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from "@/lib/api";
import { Category } from "@/types";
import { PixelButton, PixelInput, PixelCard, PixelModal } from "@/components/pixel";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const load = () => getCategories().then(setCategories).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (editId) {
      await adminUpdateCategory(editId, { name, slug });
    } else {
      await adminCreateCategory({ name, slug });
    }
    setShowModal(false);
    setEditId(null);
    setName("");
    setSlug("");
    load();
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除？")) return;
    await adminDeleteCategory(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-pixel text-sm">📁 分类管理</h1>
        <PixelButton size="sm" onClick={() => { setEditId(null); setName(""); setSlug(""); setShowModal(true); }}>
          + 新建
        </PixelButton>
      </div>

      <PixelCard>
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
            <div>
              <span className="font-bold">{cat.name}</span>
              <span className="text-text-secondary text-xs ml-2">/{cat.slug}</span>
              <span className="text-text-secondary text-xs ml-2">({cat.post_count || 0} 篇)</span>
            </div>
            <div className="flex gap-2">
              <PixelButton variant="secondary" size="sm" onClick={() => handleEdit(cat)}>编辑</PixelButton>
              <PixelButton variant="danger" size="sm" onClick={() => handleDelete(cat.id)}>删除</PixelButton>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-text-secondary text-sm py-4 text-center">暂无分类</p>}
      </PixelCard>

      <PixelModal open={showModal} onClose={() => setShowModal(false)} title={editId ? "编辑分类" : "新建分类"}>
        <div className="flex flex-col gap-3">
          <PixelInput label="名称" value={name} onChange={(e) => setName(e.target.value)} />
          <PixelInput label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <PixelButton onClick={handleSave}>保存</PixelButton>
        </div>
      </PixelModal>
    </div>
  );
}
