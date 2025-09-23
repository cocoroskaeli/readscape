import { useRef, useState } from "react";
import BookCard from "../components/BookCard";

interface CategoryRowProps {
  title: string;
  books: any[];
  loading: boolean;
}

const ITEMS_PER_PAGE = 5;

export default function CategoryRow({ title, books, loading }: CategoryRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const pagedBooks = books.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const scrollToPage = (newPage: number) => {
    setPage(newPage);
    rowRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const scrollLeft = () => {
    if (page > 0) {
      scrollToPage(page - 1);
    }
  };
  const scrollRight = () => {
    const maxPage = Math.floor((books.length - 1) / ITEMS_PER_PAGE);
    if (page < maxPage) {
      scrollToPage(page + 1);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault(); // prevent horizontal scroll with mouse wheel
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // prevent drag scroll
  };

  return (
    <section className="category-row">
      <div className="category-header">
        <h2>{title}</h2>
        <div>
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="scroll-btn left"
            disabled={page === 0}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="scroll-btn right"
            disabled={page >= Math.floor((books.length - 1) / ITEMS_PER_PAGE)}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div
        className="row-scroll"
        ref={rowRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-cover" />
                <div className="skeleton-text" />
                <div className="skeleton-text short" />
              </div>
            ))
          : pagedBooks.map((book: any) => (
              <div key={book.key} className="book-item">
                <BookCard
                  bookKey={book.key}
                  title={book.title}
                  author={book.authors?.[0]?.name || book.author_name?.[0] || "Unknown"}
                  year={book.first_publish_year}
                  coverId={book.cover_id || book.cover_i}
                />
              </div>
            ))}
      </div>
    </section>
  );
}
