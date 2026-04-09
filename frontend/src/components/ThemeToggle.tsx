"use client";

import { useThemeStore } from "@/stores/themeStore";

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 flex items-center justify-center pixel-border pixel-border-hover bg-bg text-lg"
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
