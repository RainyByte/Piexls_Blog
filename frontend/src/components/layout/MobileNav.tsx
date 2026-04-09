"use client";

import { useState } from "react";
import Link from "next/link";
import { Category } from "@/types";

interface MobileNavProps {
  categories: Category[];
}

export default function MobileNav({ categories }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-3 right-14 z-50 w-8 h-8 flex items-center justify-center pixel-border bg-bg font-pixel text-xs"
      >
        {isOpen ? "×" : "☰"}
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-bg pixel-border p-4 overflow-y-auto">
            <h3 className="font-pixel text-xs mb-4 mt-10">分类</h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm hover:text-primary"
                >
                  📁 {cat.name} ({cat.post_count || 0})
                </Link>
              ))}
            </div>
            <hr className="my-4 border-border" />
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="text-sm hover:text-primary"
            >
              ⚙️ Admin
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
