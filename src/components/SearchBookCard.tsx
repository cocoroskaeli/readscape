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
  onReadClick?: () => void; // ќе се користи ако сакаш дополнителна логика
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
  const lastAction = useShelfStore((state) => state.lastAction);
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
    addBook("reading", { key: bookKey, title, author, year, coverId });
    if (lastAction === "added") {
      toast.success(t("addedTo") + " " + t("reading"));
      setIsReading(true);
    } else if (lastAction === "exists") {
      toast.error(t("alreadyInShelf"));
    }
    if (onReadClick) onReadClick();
  };

  return (
    <Link to={`/book/${bookKey.replace("/works/", "")}`} className="search-card-link">
      <div className="search-card">
        <img src={coverUrl} alt={title} className="search-card-cover" />
        <div className="search-card-info">
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
