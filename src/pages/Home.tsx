import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { searchBooks, fetchTrending, fetchSubjectBooks } from "../api";
import CategoryRow from "../components/CategoryRow";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "./Home.css";
import BookCard from "../components/BookCard";

export default function Home() {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [trending, setTrending] = useState<any[]>([]);
  const [classics, setClassics] = useState<any[]>([]);
  const [romance, setRomance] = useState<any[]>([]);
  const [kids, setKids] = useState<any[]>([]);
  const [thrillers, setThrillers] = useState<any[]>([]);
  const [textbooks, setTextbooks] = useState<any[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

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
        setTrending(t.works);
        setClassics(c.works);
        setRomance(r.works);
        setKids(k.works);
        setThrillers(th.works);
        setTextbooks(tb.works);
      } catch (err) {
        console.error("Error loading sections:", err);
      } finally {
        setLoadingSections(false);
      }
    }
    loadAll();
  }, []);

  return (
    <div
      className="min-h-screen p-4"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <header
        className="sticky top-16 border-b p-4 z-10"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        <SearchBar onSearch={handleSearch} initialValue={lastQuery} />
      </header>
      <main className="mt-4">
        {loadingSearch ? (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-cover" />
                <div className="skeleton-text" />
                <div className="skeleton-text short" />
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid">
            {searchResults.map((book) => (
              <BookCard
                key={book.key}
                bookKey={book.key}
                title={book.title}
                author={book.author_name?.[0] || t("unknown")}
                year={book.first_publish_year}
                coverId={book.coveri}
              />
            ))}
          </div>
        ) : (
          <>
            <CategoryRow
              title="Trending Books"
              books={trending}
              loading={loadingSections}
            />
            <CategoryRow
              title="Classic Books"
              books={classics}
              loading={loadingSections}
            />
            <CategoryRow
              title="Romance"
              books={romance}
              loading={loadingSections}
            />
            <CategoryRow
              title="Kids"
              books={kids}
              loading={loadingSections}
            />
            <CategoryRow
              title="Thrillers"
              books={thrillers}
              loading={loadingSections}
            />
            <CategoryRow
              title="Textbooks"
              books={textbooks}
              loading={loadingSections}
            />
          </>
        )}
      </main>
    </div>
  );
}