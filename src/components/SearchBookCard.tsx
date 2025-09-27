// src/components/SearchBookCard.tsx
import React from "react";
import "./SearchBookCard.css";

interface SearchBookCardProps {
  title: string;
  author: string;
  coverId?: number | null;
  year?: number;
  onReadClick?: () => void;
}

const SearchBookCard: React.FC<SearchBookCardProps> = ({
  title,
  author,
  coverId,
  year,
  onReadClick,
}) => {
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/80x120?text=No+Cover";

  return (
    <div className="search-card">
      <img src={coverUrl} alt={title} className="search-card-cover" />
      <div className="search-card-info">
        <h3 className="search-card-title">{title}</h3>
        <p className="search-card-author">by {author}</p>
        {year && <p className="search-card-year">First published {year}</p>}
      </div>
      <div className="search-card-btn-wrapper">
        <button className="search-card-btn" onClick={onReadClick}>
          Read
        </button>
      </div>
    </div>
  );
};

export default SearchBookCard;

