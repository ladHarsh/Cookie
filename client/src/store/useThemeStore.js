import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Cookie-theme") || "cupcake",
  setTheme: (theme) => {
    localStorage.setItem("Cookie-theme", theme);
    set({ theme });
  },
}));
