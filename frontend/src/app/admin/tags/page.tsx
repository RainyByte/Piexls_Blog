"use client";

import { useEffect, useState } from "react";
import { getTags, adminCreateTag, adminUpdateTag, adminDeleteTag } from "@/lib/api";
import { Tag } from "@/types";
import { PixelButton, PixelInput, PixelSelect, PixelCard, PixelModal, PixelTag } from "@/components/pixel";

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("blue");

  const load = () => getTags().then(setTags).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (editId) {
      await adminUpdateTag(editId, { name, slug, color });
    } else {
      await adminCreateTag({ name, slug, color });
    }
    setShowModal(false);
    setEditId(null);
    setName("");
    setSlug("");
    setColor("blue");
    load();
  };

  const handleEdit = (tag: Tag) => {
    setEditId(tag.id);
    setName(tag.name);
    setSlug(tag.slug);
    setColor(tag.color);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除？")) return;
    await adminDeleteTag(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-pixel text-sm">🏷️ 标签管理</h1>
        <PixelButton size="sm" onClick={() => { setEditId(null); setName(""); setSlug(""); setColor("blue"); setShowModal(true); }}>
          + 新建
        </PixelButton>
      </div>

      <PixelCard>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2 p-2 border border-border/30">
              <PixelTag color={tag.color}>{tag.name}</PixelTag>
              <button onClick={() => handleEdit(tag)} className="text-xs hover:text-primary">✏️</button>
              <button onClick={() => handleDelete(tag.id)} className="text-xs hover:text-red">🗑️</button>
            </div>
          ))}
        </div>
        {tags.length === 0 && <p className="text-text-secondary text-sm py-4 text-center">暂无标签</p>}
      </PixelCard>

      <PixelModal open={showModal} onClose={() => setShowModal(false)} title={editId ? "编辑标签" : "新建标签"}>
        <div className="flex flex-col gap-3">
          <PixelInput label="名称" value={name} onChange={(e) => setName(e.target.value)} />
          <PixelInput label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <PixelSelect
            label="颜色"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            options={[
              { value: "blue", label: "蓝色" },
              { value: "yellow", label: "黄色" },
              { value: "green", label: "绿色" },
              { value: "red", label: "红色" },
            ]}
          />
          <PixelButton onClick={handleSave}>保存</PixelButton>
        </div>
      </PixelModal>
    </div>
  );
}
