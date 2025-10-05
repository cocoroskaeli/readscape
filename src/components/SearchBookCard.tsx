import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useShelfStore } from "../store/shelfStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "./SearchBookCard.css";

interface SearchBookCardProps {
  title: string;
  author: string;
  coverId?: number;
  year?: number;
  bookKey: string;
  onReadClick?: () => void;
}

const SearchBookCard: React.FC<SearchBookCardProps> = ({
  title,
  author,
  coverId,
  year,
  bookKey,
  onReadClick,
}) => {
  const { t } = useTranslation();

  const addBook = useShelfStore((state) => state.addBook);
  const shelf = useShelfStore((state) => state.shelf);

  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    setIsReading(shelf.reading.some((book) => book.key === bookKey));
  }, [shelf.reading, bookKey]);

  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/80x120?text=No+Cover";

  const handleReading = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isReading) {
      toast.error(t("alreadyInShelf"));
      return;
    }
    addBook("reading", { key: bookKey, title, author, year, coverId });
    toast.success(t("addedTo") + " " + t("reading"));
    setIsReading(true);
    if (onReadClick) onReadClick();
  };

  return (
    <Link to={`/book/${bookKey.replace("/works/", "")}`} className="search-card-link">
      <div className="search-card" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
        <img src={coverUrl} alt={title} className="search-card-cover" />
        <div className="search-card-info" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
          <h3 className="search-card-title">{title}</h3>
          <p className="search-card-author">{t("byAuthor", { authors: author })}</p>
          {year && <p className="search-card-year">{t("firstPublished", { year })}</p>}
        </div>
        <div className="search-card-btn-wrapper">
          <button
            className={`search-card-btn ${isReading ? "reading" : ""}`}
            onClick={handleReading}
          >
            {isReading ? t("Reading") : t("read")}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default SearchBookCard;
