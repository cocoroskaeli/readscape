import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "system"
  );

  useEffect(() => {
  const root = window.document.documentElement;

  if (theme === "system") {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", systemDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }

  localStorage.setItem("theme", theme);
}, [theme]);

  return { theme, setTheme };
}