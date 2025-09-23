import { useState, useEffect } from "react";
import "./SearchBar.css";
import { useTranslation } from "react-i18next";

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
    <input
      type="text"
      className="search-bar"
      placeholder={t("searchPlaceholder")}
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
}