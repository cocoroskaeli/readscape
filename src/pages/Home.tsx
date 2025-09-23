import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { searchBooks, fetchTrending, fetchSubjectBooks } from "../api";
import CategoryRow from "../components/CategoryRow";
import BookCard from "../components/BookCard";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "./Home.css";

export default function Home() {
  const { t } = useTranslation();
  const mainRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [fullSearchResults, setFullSearchResults] = useState<any[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [trending, setTrending] = useState<any[]>([]);
  const [classics, setClassics] = useState<any[]>([]);
  const [romance, setRomance] = useState<any[]>([]);
  const [kids, setKids] = useState<any[]>([]);
  const [thrillers, setThrillers] = useState<any[]>([]);
  const [textbooks, setTextbooks] = useState<any[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

  const location = useLocation();

  async function handleSearch(query: string) {
    if (!query) {
      setFullSearchResults([]);
      setLastQuery("");
      setSearchPage(1);
      sessionStorage.removeItem("lastSearch");
      return;
    }
    setLoadingSearch(true);
    try {
      const data = await searchBooks(query);
      const docs = Array.isArray(data.docs) ? data.docs : [];
      setFullSearchResults(docs);
      setSearchPage(1);
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
    const params = new URLSearchParams(location.search);
    if (params.get("reset") === "true") {
      setFullSearchResults([]);
      setLastQuery("");
      setSearchPage(1);
      sessionStorage.removeItem("lastSearch");
    } else {
      const stored = sessionStorage.getItem("lastSearch");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.query && parsed.books) {
          setLastQuery(parsed.query);
          setFullSearchResults(parsed.books);
          setSearchPage(1);
        }
      }
    }
  }, [location.search]);

  useEffect(() => {
    async function loadAll() {
      try {
        const [t, c, r, k, th, tb] = await Promise.all([
          fetchTrending("daily"),
          fetchSubjectBooks("classics", 12),
          fetchSubjectBooks("romance", 12),
          fetchSubjectBooks("children", 12),
          fetchSubjectBooks("suspense", 12),
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

  const pageResults = fullSearchResults.slice(
    (searchPage - 1) * ITEMS_PER_PAGE,
    searchPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(fullSearchResults.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageIndex: number) => {
    setSearchPage(pageIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function scrollToCategories() {
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div
      ref={mainRef}
      className="min-h-screen p-4"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <header
        className="sticky top-16 border-b p-4 z-10"
        style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
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
        ) : fullSearchResults.length > 0 ? (
          <>
            <div className="search-results-vertical">
              {pageResults.map((book) => (
                <BookCard
                  key={book.key}
                  bookKey={book.key}
                  title={book.title}
                  author={book.author_name?.[0] || t("unknown")}
                  year={book.first_publish_year}
                  coverId={book.cover_i || book.cover_id || null}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageIndex = i + 1;
                  return (
                    <button
                      key={pageIndex}
                      onClick={() => handlePageChange(pageIndex)}
                      className={searchPage === pageIndex ? "active" : ""}
                    >
                      {pageIndex}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div ref={categoriesRef}>
            <CategoryRow
              title="Trending Books"
              books={trending}
              loading={loadingSections}
              itemsPerPage={5}
            />
            <CategoryRow
              title="Classic Books"
              books={classics}
              loading={loadingSections}
              itemsPerPage={5}
            />
            <CategoryRow
              title="Romance"
              books={romance}
              loading={loadingSections}
              itemsPerPage={5}
            />
            <CategoryRow
              title="Kids"
              books={kids}
              loading={loadingSections}
              itemsPerPage={5}
            />
            <CategoryRow
              title="Thrillers"
              books={thrillers}
              loading={loadingSections}
              itemsPerPage={5}
            />
            <CategoryRow
              title="Textbooks"
              books={textbooks}
              loading={loadingSections}
              itemsPerPage={5}
            />
          </div>
        )}
      </main>
    </div>
  );
}
