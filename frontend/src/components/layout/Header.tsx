"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="pixel-border bg-bg mb-6">
      <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
        <Link href="/" className="font-pixel text-sm md:text-base text-primary hover:opacity-80 tracking-wide">
          PIXEL BLOG
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-pixel text-[0.55rem] hover:text-primary transition-colors">
            HOME
          </Link>
          <Link href="/admin/login" className="font-pixel text-[0.55rem] hover:text-primary transition-colors">
            SIGN IN
          </Link>
          <ThemeToggle />
        </nav>
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
