import { useState, useEffect } from "react";
import './SearchBar.css';
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState("");
  const { t } = useTranslation(); // додавање i18n

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
