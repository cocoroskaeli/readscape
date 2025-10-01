import { useState } from "react";
import BookCard from "../components/BookCard";

interface CategoryRowProps {
  title: string;
  books: any[];
  loading: boolean;
  itemsPerPage?: number;
  activeTab?: string; // Додај за да проследуваш таб статус
}

export default function CategoryRow({
  title,
  books,
  loading,
  itemsPerPage = 5,
  activeTab,
}: CategoryRowProps) {
  const [page, setPage] = useState(0);

  const pagedBooks = books.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const scrollLeft = () => setPage((p) => Math.max(p - 1, 0));
  const scrollRight = () =>
    setPage((p) => Math.min(p + 1, Math.floor((books.length - 1) / itemsPerPage)));

  return (
    <section className="category-row">
      <div className="category-header">
        <h2>{title}</h2>
      </div>

      <div className="books-row-wrapper">
        {/* Лево копче */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll left"
          className="scroll-btn left"
          disabled={page === 0}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.7" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
              stroke="#088bcd"
            />
          </svg>
        </button>

        {/* Книги + празни слотови */}
        <div className="row-fixed">
          {loading
            ? Array.from({ length: itemsPerPage }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-cover" />
                  <div className="skeleton-text" />
                  <div className="skeleton-text short" />
                </div>
              ))
            : pagedBooks.map((book) =>
                book.empty ? (
                  <div
                    key={book.key}
                    className="book-item empty-slot"
                    style={{ flex: `0 0 ${100 / itemsPerPage}%` }}
                  />
                ) : (
                  <div
                    key={book.key}
                    className="book-item"
                    style={{ flex: `0 0 ${100 / itemsPerPage}%` }}
                  >
                    <BookCard
                      bookKey={book.key}
                      title={book.title}
                      author={
                        book.authors?.[0]?.name ||
                        book.author_name?.[0] ||
                        "Unknown"
                      }
                      year={book.first_publish_year}
                      coverId={book.cover_i || book.cover_id || null}
                      activeTab={activeTab}  // Проследи го activeTab
                    />
                  </div>
                )
              )}
        </div>

        {/* Десно копче */}
        <button
          onClick={scrollRight}
          aria-label="Scroll right"
          className="scroll-btn right"
          disabled={page >= Math.floor((books.length - 1) / itemsPerPage)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.7" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
              stroke="#088bcd"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
