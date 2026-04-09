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
        className="md:hidden fixed top-4 right-4 z-50 w-9 h-9 flex items-center justify-center pixel-border bg-bg font-pixel text-xs cursor-pointer"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? "X" : "="}
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-bg pixel-border p-4 overflow-y-auto">
            <h3 className="font-pixel text-[0.55rem] mb-4 mt-12 text-text-secondary">// CATEGORIES</h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                >
                  <span>{cat.name}</span>
                  <span className="font-pixel text-[0.4rem] px-1.5 py-0.5 bg-text text-bg">
                    {cat.post_count || 0}
                  </span>
                </Link>
              ))}
            </div>
            <hr className="my-4 border-border" />
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="font-pixel text-[0.55rem] hover:text-primary transition-colors"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
