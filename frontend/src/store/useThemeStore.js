import { create } from "zustand";

export const THEMES = [
  "whatsapp-dark",
  "whatsapp-light",
  "midnight",
  "coffee"
];

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "whatsapp-dark",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
