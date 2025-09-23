import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import { searchBooks } from "../api";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import './Home.css';

export default function Home() {
  const { t } = useTranslation();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");


  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("lastSearch");
      if (saved) {
        const parsed = JSON.parse(saved);
        setBooks(parsed.books || []);
        setLastQuery(parsed.query || "");
      }
    } catch (err) {
      console.error("Failed to parse sessionStorage lastSearch", err);
      sessionStorage.removeItem("lastSearch");
    }
  }, []);

  async function handleSearch(query: string) {
    if (!query) {
      setBooks([]);
      sessionStorage.removeItem("lastSearch");
      setLastQuery("");
      return;
    }

    setLoading(true);
    try {
      const data = await searchBooks(query);
      const docs = Array.isArray(data.docs) ? data.docs.slice(0, 100) : [];

      setBooks(docs);
      setLastQuery(query);

      sessionStorage.setItem(
        "lastSearch",
        JSON.stringify({ query, books: docs, savedAt: Date.now() })
      );
    } catch (err) {
      console.error("Search error:", err);

      toast(
        (toastObj) => (
          <div>
            <span>{t("errorFetch")}</span>
            <button
              onClick={() => {
                handleSearch(query);
                toast.dismiss(toastObj.id);
              }}
              className="ml-2 underline"
            >
              {t("retry")}
            </button>
          </div>
        ),
        { duration: 8000 }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white min-h-screen p-4">
      <header className="sticky top-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
        <SearchBar onSearch={handleSearch} initialValue={lastQuery} />
      </header>

      <main className="mt-4">
        {/* Skeletons */}
        {loading && (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-cover" />
                <div className="skeleton-text" />
                <div className="skeleton-text" style={{ width: "60%" }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && books.length === 0 && (
          <div className="text-center">
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t("noResults")}
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && books.length > 0 && (
          <div className="grid">
            {books.map((book) => (
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
      </main>
    </div>
  );
}