import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useShelfStore } from "../store/shelfStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface BookCardProps {
  title: string;
  author: string;
  year?: number;
  coverId?: number;
  bookKey: string;
  activeTab?: string;
}

export default function BookCard({ title, author, year, coverId, bookKey, activeTab }: BookCardProps) {
  const { t } = useTranslation();
  const addBook = useShelfStore((state) => state.addBook);
  const removeBook = useShelfStore((state) => state.removeBook);
  const lastAction = useShelfStore((state) => state.lastAction);
  const shelf = useShelfStore((state) => state.shelf);

  const [isWanted, setIsWanted] = useState(false);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    setIsWanted(shelf.want.some((book) => book.key === bookKey));
    setIsReading(shelf.reading.some((book) => book.key === bookKey));
  }, [shelf.want, shelf.reading, bookKey]);

  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  const handleToggleWant = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Не дозволувај додавање во want ако книгата е во reading или finished
    const inReading = shelf.reading.some((book) => book.key === bookKey);
    const inFinished = shelf.finished.some((book) => book.key === bookKey);
    if (inReading || inFinished) {
      toast.error(t("Cannot add to want: already in reading or finished"));
      return;
    }

    if (isWanted) {
      removeBook("want", bookKey);
      toast.success(t("removed from") + " ♥");
      setIsWanted(false);
    } else {
      addBook("want", { key: bookKey, title, author, year, coverId });
      toast.success(t("addedTo") + " ♥");
      setIsWanted(true);
    }
  };

  const handleReading = () => {
    removeBook("want", bookKey);
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
    toast.success(t("Moved to Finished"));
  };

  return (
    <div className="book-card bg-white dark:bg-gray-700 text-black dark:text-white p-4 rounded shadow">
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
          {t("Finish")}
        </button>
      ) : activeTab === "finished" ? (
        <button className="btn-reading reading" disabled type="button">
          {t("Finished")}
        </button>
      ) : (
        <button
          className={`btn-reading ${isReading ? "reading" : ""}`}
          onClick={handleReading}
          type="button"
        >
          {isReading ? t("Reading") : t("read")}
        </button>
      )}
    </div>
  );
}





