import React, { useState, useEffect } from "react";
import { setDarkModeOnHtml } from "../utils/themeUtils";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      setDarkModeOnHtml(true);
    } else {
      setDarkMode(false);
      setDarkModeOnHtml(false);
    }
  }, []);

  useEffect(() => {
    setDarkModeOnHtml(darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded bg-gray-200 text-gray-800 text-xl"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;