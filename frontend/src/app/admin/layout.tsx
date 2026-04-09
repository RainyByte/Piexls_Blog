"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/music", label: "Music" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthed(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/admin/login");
        return;
      }
    } catch {
      localStorage.removeItem("token");
      router.push("/admin/login");
      return;
    }

    setAuthed(true);
  }, [pathname, router]);

  if (!authed) return null;

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-bg">
      <header className="pixel-border bg-bg mb-6">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-pixel text-sm text-primary hover:opacity-80">
            PIXEL BLOG
          </Link>
          <div className="flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-pixel text-[0.5rem] transition-colors ${
                  pathname.startsWith(item.href) ? "text-primary" : "hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/admin/login");
              }}
              className="font-pixel text-[0.5rem] text-red hover:opacity-80 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-4">{children}</main>
    </div>
  );
}
