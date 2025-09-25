import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { searchBooks, fetchTrending, fetchSubjectBooks } from "../api";
import CategoryRow from "../components/CategoryRow";
import BookCard from "../components/BookCard";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "./Home.css";
import CardInfo from "../components/CardInfo";

interface OutletContext {
  query: string;
}

export default function Home() {
  const { t } = useTranslation();
  const { query } = useOutletContext<OutletContext>();
  const categoriesRef = useRef<HTMLDivElement>(null);

  const [fullSearchResults, setFullSearchResults] = useState<any[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [trending, setTrending] = useState<any[]>([]);
  const [classics, setClassics] = useState<any[]>([]);
  const [romance, setRomance] = useState<any[]>([]);
  const [kids, setKids] = useState<any[]>([]);
  const [thrillers, setThrillers] = useState<any[]>([]);
  const [textbooks, setTextbooks] = useState<any[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

  useEffect(() => {
    async function runSearch() {
      if (!query) {
        setFullSearchResults([]);
        return;
      }
      setLoadingSearch(true);
      try {
        const data = await searchBooks(query);
        const docs = Array.isArray(data.docs) ? data.docs : [];
        setFullSearchResults(docs);
        setSearchPage(1);
      } catch (err) {
        console.error("Search error:", err);
        toast.error(t("errorFetch"));
      } finally {
        setLoadingSearch(false);
      }
    }
    runSearch();
  }, [query]);

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

  return (
    <div className="main-bg">
      <div className="center-container">
       <CardInfo/>
        {loadingSearch ? (
          <div className="loader-container">
            {Array.from({ length: 20 }).map((_, i) => (
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
                      onClick={() => setSearchPage(pageIndex)}
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
      </div>
    </div>
  );
}