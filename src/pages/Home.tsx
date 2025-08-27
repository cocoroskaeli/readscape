import { useState } from "react";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import { searchBooks } from "../api";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(query: string) {
    if (!query) {
      setBooks([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchBooks(query);
      setBooks(data.docs);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white min-h-screen p-4">
      <header className="sticky top-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
        <SearchBar onSearch={handleSearch}/>
      </header>

      <main className="mt-4">
        {loading && (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(180px,_1fr))]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 w-40 h-56">
                <div className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse h-44 w-full"></div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse h-4 w-full"></div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse h-4 w-3/5"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && books.length === 0 && <p>{t("noResults")}</p>}

        {!loading && (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(180px,_1fr))]">
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