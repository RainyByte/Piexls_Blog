"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminGetPosts, adminDeletePost } from "@/lib/api";
import { Post, PaginatedResponse } from "@/types";
import { PixelButton, PixelCard } from "@/components/pixel";

export default function AdminPostsPage() {
  const [data, setData] = useState<PaginatedResponse<Post> | null>(null);
  const [page] = useState(1);

  const load = async () => {
    const result = await adminGetPosts(page, 20);
    setData(result);
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除？")) return;
    await adminDeletePost(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-pixel text-sm">📝 文章管理</h1>
        <Link href="/admin/posts/new">
          <PixelButton size="sm">+ 新建文章</PixelButton>
        </Link>
      </div>

      <PixelCard>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-2 font-pixel text-xs">标题</th>
              <th className="text-left py-2 font-pixel text-xs">状态</th>
              <th className="text-left py-2 font-pixel text-xs">日期</th>
              <th className="text-right py-2 font-pixel text-xs">操作</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((post) => (
              <tr key={post.id} className="border-b border-border/30">
                <td className="py-2">{post.title}</td>
                <td className="py-2">
                  <span className={`font-pixel text-[0.5rem] ${post.is_published ? "text-green" : "text-yellow"}`}>
                    {post.is_published ? "已发布" : "草稿"}
                  </span>
                </td>
                <td className="py-2 text-text-secondary text-xs">
                  {new Date(post.updated_at).toLocaleDateString("zh-CN")}
                </td>
                <td className="py-2 text-right">
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <PixelButton variant="secondary" size="sm" className="mr-2">
                      编辑
                    </PixelButton>
                  </Link>
                  <PixelButton variant="danger" size="sm" onClick={() => handleDelete(post.id)}>
                    删除
                  </PixelButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PixelCard>
    </div>
  );
}
