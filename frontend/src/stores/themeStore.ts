import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (typeof window !== "undefined"
    ? (document.documentElement.getAttribute("data-theme") as Theme) || "light"
    : "light"),
  toggle: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      return { theme: next };
    }),
}));
