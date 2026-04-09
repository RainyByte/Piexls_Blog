"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="pixel-border bg-bg mb-6">
      <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
        <Link href="/" className="font-pixel text-sm md:text-base text-primary hover:opacity-80">
          🎮 PIXEL BLOG
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-pixel text-[0.6rem] hover:text-primary">
            Home
          </Link>
          <Link href="/admin" className="font-pixel text-[0.6rem] hover:text-primary">
            Admin
          </Link>
          <ThemeToggle />
        </nav>
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
