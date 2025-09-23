import { useState, useEffect, useRef } from "react";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import { searchBooks, fetchTrending, fetchSubjectBooks } from "../api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "./Home.css";

export default function Home() {
  const { t } = useTranslation();

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  // категории
  const [trending, setTrending] = useState<any[]>([]);
  const [classics, setClassics] = useState<any[]>([]);
  const [romance, setRomance] = useState<any[]>([]);
  const [kids, setKids] = useState<any[]>([]);
  const [thrillers, setThrillers] = useState<any[]>([]);
  const [textbooks, setTextbooks] = useState<any[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

  // 🔍 Search handler
  async function handleSearch(query: string) {
    if (!query) {
      setSearchResults([]);
      setLastQuery("");
      sessionStorage.removeItem("lastSearch");
      return;
    }

    setLoadingSearch(true);
    try {
      const data = await searchBooks(query);
      const docs = Array.isArray(data.docs) ? data.docs.slice(0, 50) : [];
      setSearchResults(docs);
      setLastQuery(query);

      sessionStorage.setItem(
        "lastSearch",
        JSON.stringify({ query, books: docs, savedAt: Date.now() })
      );
    } catch (err) {
      console.error("Search error:", err);
      toast.error(t("errorFetch"));
    } finally {
      setLoadingSearch(false);
    }
  }

  // 📚 Load categories once
  useEffect(() => {
    async function loadAll() {
      try {
        const [t, c, r, k, th, tb] = await Promise.all([
          fetchTrending("daily"),
          fetchSubjectBooks("classics", 12),
          fetchSubjectBooks("romance", 12),
          fetchSubjectBooks("children", 12),
          fetchSubjectBooks("suspense", 12), // Thrillers
          fetchSubjectBooks("textbooks", 12),
        ]);

        setTrending(t.works || []);
        setClassics(c.works || []);
        setRomance(r.works || []);
        setKids(k.works || []);
        setThrillers(th.works || []);
        setTextbooks(tb.works || []);
      } catch (err) {
        console.error("Error loading sections:", err);
      } finally {
        setLoadingSections(false);
      }
    }
    loadAll();
  }, []);

  // helper со стрелки
  const renderRow = (title: string, books: any[]) => {
    const rowRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
      if (rowRef.current) rowRef.current.scrollBy({ left: -400, behavior: "smooth" });
    };
    const scrollRight = () => {
      if (rowRef.current) rowRef.current.scrollBy({ left: 400, behavior: "smooth" });
    };

    return (
      <div className="mb-10 relative">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <button className="scroll-btn left" onClick={scrollLeft}>‹</button>
        <div className="row-scroll" ref={rowRef}>
          {loadingSections
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-cover" />
                  <div className="skeleton-text" />
                  <div className="skeleton-text short" />
                </div>
              ))
            : books.map((book) => (
                <div key={book.key} className="book-item">
                  <BookCard
                    bookKey={book.key}
                    title={book.title}
                    author={
                      book.authors?.[0]?.name ||
                      book.author_name?.[0] ||
                      "Unknown"
                    }
                    year={book.first_publish_year}
                    coverId={book.cover_id || book.cover_i}
                  />
                </div>
              ))}
        </div>
        <button className="scroll-btn right" onClick={scrollRight}>›</button>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen p-4"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      {/* 🔍 Search bar */}
      <header
        className="sticky top-16 border-b p-4 z-10"
        style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
      >
        <SearchBar onSearch={handleSearch} initialValue={lastQuery} />
      </header>

      <main className="mt-4">
        {/* Search results */}
        {loadingSearch && (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-cover" />
                <div className="skeleton-text" />
                <div className="skeleton-text short" />
              </div>
            ))}
          </div>
        )}

        {!loadingSearch && searchResults.length > 0 && (
          <div className="grid">
            {searchResults.map((book) => (
              <BookCard
                key={book.key}
                bookKey={book.key}
                title={book.title}
                author={book.author_name?.[0] || t("unknown")}
                year={book.first_publish_year}
                coverId={book.cover_i}
              />
            ))}
          </div>
        )}

        {/* Categories */}
        {!loadingSearch && searchResults.length === 0 && (
          <>
            {renderRow("🔥 Trending Books", trending)}
            {renderRow("📚 Classic Books", classics)}
            {renderRow("💖 Romance", romance)}
            {renderRow("👶 Kids", kids)}
            {renderRow("🔪 Thrillers", thrillers)}
            {renderRow("📖 Textbooks", textbooks)}
          </>
        )}
      </main>
    </div>
  );
}