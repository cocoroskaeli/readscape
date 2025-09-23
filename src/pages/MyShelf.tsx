import { useState } from "react";
import { useShelfStore } from "../store/shelfStore";
import BookCard from "../components/BookCard";
import { useTranslation } from "react-i18next";

export default function MyShelf() {
  const { shelf } = useShelfStore();
  const [activeTab, setActiveTab] = useState<"want" | "reading" | "finished">(
    "want"
  );
  const { t } = useTranslation();

  const tabs = ["want", "reading", "finished"] as const;

  const renderBooks = (books: typeof shelf.want) =>
    books.length === 0 ? (
      <p>{t("noBooksYet")}</p>
    ) : (
      books.map((book) => (
        <BookCard
          key={book.key}
          bookKey={book.key}
          title={book.title}
          author={book.author || t("unknownAuthor")}
          year={book.year}
          coverId={book.coverId}
        />
      ))
    );

  return (
    <div
      className="p-4"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <h1 className="text-xl font-bold mb-4">📚 {t("shelf")}</h1>

      <div className="flex gap-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold rounded ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {activeTab === "want" && renderBooks(shelf.want)}
        {activeTab === "reading" && renderBooks(shelf.reading)}
        {activeTab === "finished" && renderBooks(shelf.finished)}
      </div>
    </div>
  );
}