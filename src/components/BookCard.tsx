import { Link } from "react-router-dom";
import { useShelfStore } from "../store/shelfStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface BookCardProps {
  title: string;
  author: string;
  year?: number;
  coverId?: number;
  bookKey: string; // ова мора да биде "/works/..." кога го добиваш
  activeTab?: string;
}

export default function BookCard({ title, author, year, coverId, bookKey, activeTab }: BookCardProps) {
  const { t } = useTranslation();
  const addBook = useShelfStore((state) => state.addBook);
  const removeBook = useShelfStore((state) => state.removeBook);
  const lastAction = useShelfStore((state) => state.lastAction);
  const shelf = useShelfStore((state) => state.shelf);

  const isWanted = shelf.want.some((book) => book.key === bookKey);
  const isReading = shelf.reading.some((book) => book.key === bookKey);
  const isFinished = shelf.finished.some((book) => book.key === bookKey);

  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  const handleToggleWant = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isReading || isFinished) {
      toast.error(t("cannotAddToWant"));
      return;
    }

    if (isWanted) {
      removeBook("want", bookKey);
      toast.success(t("removedFrom") + " ♥");
    } else {
      addBook("want", { key: bookKey, title, author, year, coverId });
      toast.success(t("addedTo") + " ♥");
    }
  };

  const handleReading = () => {
    if (isWanted) {
      removeBook("want", bookKey);
    }
    addBook("reading", { key: bookKey, title, author, year, coverId });
    if (lastAction === "added") {
      toast.success(t("addedTo") + " " + t("reading"));
    } else if (lastAction === "exists") {
      toast.error(t("alreadyInShelf"));
    }
  };

  const handleFinish = () => {
    removeBook("reading", bookKey);
    addBook("finished", { key: bookKey, title, author, year, coverId });
    toast.success(t("movedToFinished"));
  };

  return (
    <div className="book-card bg-white dark:bg-gray-700 text-black dark:text-white p-4 rounded shadow"  style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
      <div className="image-wrapper" style={{ position: "relative" }}>
        <Link to={`/book/${bookKey.replace("/works/", "")}`}>
          <img src={coverUrl} alt={title} className="book-cover-image" />
        </Link>
        <button
          onClick={handleToggleWant}
          aria-label="Add to want shelf"
          className={`heart-button ${isWanted ? "wanted" : ""}`}
          type="button"
        >
          ♥
        </button>
      </div>

      {activeTab === "reading" ? (
        <button className="btn-reading reading" onClick={handleFinish} type="button">
          {t("finish")}
        </button>
      ) : activeTab === "finished" ? (
        <button className="btn-reading reading" disabled type="button">
          {t("finished")}
        </button>
      ) : (
        <button
          className={`btn-reading ${isReading ? "reading" : ""}`}
          onClick={handleReading}
          type="button"
        >
          {isReading ? t("reading") : t("read")}
        </button>
      )}
    </div>
  );
}
