import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export default function SearchBar({ onSearch, initialValue = "" }: SearchBarProps) {
  const [input, setInput] = useState(initialValue);
  const { t } = useTranslation();

  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(input);
    }, 700);
    return () => clearTimeout(handler);
  }, [input]);

  return (
    <div className="search-box"style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }} >
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        placeholder={t("searchPlaceholder")}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}