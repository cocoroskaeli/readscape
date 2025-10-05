import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBookDetails, fetchAuthorName } from "../api";
import { useShelfStore } from "../store/shelfStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const bookKey = `/works/${id}`;
  const [book, setBook] = useState<any>(null);
  const [authors, setAuthors] = useState<string[]>([]);
  const [rating, setRating] = useState(0);

  const addBook = useShelfStore((state) => state.addBook);
  const removeBook = useShelfStore((state) => state.removeBook);
  const lastAction = useShelfStore((state) => state.lastAction);
  const shelf = useShelfStore((state) => state.shelf);

  const isReading = shelf.reading.some((b) => b.key === bookKey);
  const isWanted = shelf.want.some((b) => b.key === bookKey);
  const isFinished = shelf.finished.some((b) => b.key === bookKey);

  useEffect(() => {
    if (!id) return;
    getBookDetails(id)
      .then(async (data) => {
        setBook(data);
        if (data.authors?.length > 0) {
          const names = await fetchAuthorName(data.authors);
          setAuthors(names);
        }
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const savedRating = localStorage.getItem(`rating_${id}`);
    if (savedRating) setRating(Number(savedRating));
  }, [id]);

  const handleToggleWant = () => {
    if (isReading || isFinished) {
      toast.error(t("cannotAddWant"));
      return;
    }
    if (isWanted) {
      removeBook("want", bookKey);
      toast.success(t("removedFromWant"));
    } else {
      addBook("want", {
        key: bookKey,
        title: book.title,
        author: authors.join(", "),
        coverId: book.covers?.[0],
      });
      toast.success(t("addedToWant"));
    }
  };

  const handleReading = () => {
    if (isWanted) {
      removeBook("want", bookKey);
    }
    addBook("reading", {
      key: bookKey,
      title: book.title,
      author: authors.join(", "),
      coverId: book.covers?.[0],
    });
    if (lastAction === "added") {
      toast.success(t("movedToReading"));
    } else if (lastAction === "exists") {
      toast.error(t("alreadyInShelf"));
    }
  };

  const handleSetRating = (star: number) => {
    setRating(star);
    localStorage.setItem(`rating_${id}`, String(star));
    toast(t("ratedBook", { star }));
  };

  if (!book) {
    return (
      <div className="center-container" style={{ minHeight: "340px" }}>
        <p>{t("loading")}</p>
      </div>
    );
  }

  let desc = t("noDescription");
  if (book.description) {
    if (typeof book.description === "string") {
      desc = book.description;
    } else if (typeof book.description === "object" && book.description.value) {
      desc = book.description.value;
    }
  }

  const coverId = book.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : "https://via.placeholder.com/180x250?text=No+Cover";

  return (
    <div className="center-container details-center">
      <div className="book-info-flex">
        <div className="book-cover-col" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button
            onClick={handleToggleWant}
            className={`heart-button ${isWanted ? "wanted" : ""}`}
            aria-label={t("toggleWant")}
            style={{ position: "absolute", top: "8px", left: "8px", zIndex: 2 }}
          >
            ♥
          </button>
          <img src={coverUrl} alt={book.title} className="book-details-cover" />
          {!isFinished && (
            <button
              className={`btn-reading ${isReading ? "reading" : ""}`}
              onClick={handleReading}
              type="button"
              style={{ marginTop: "10px" }}
            >
              {isReading ? t("Reading") : t("read")}
            </button>
          )}
          <div className="rating-stars" style={{ marginTop: "18px", display: "flex" }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`star ${num <= rating ? "filled" : ""}`}
                onClick={() => handleSetRating(num)}
                role="button"
                aria-label={t("rateStar", { star: num })}
                style={{
                  cursor: "pointer",
                  fontSize: 28,
                  color: num <= rating ? "#ffb400" : "#ccc",
                  userSelect: "none",
                  marginRight: 8,
                  transition: "color 0.3s ease",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="book-details-col">
          <h1 className="book-title-details">{book.title}</h1>
          {authors.length > 0 && (
            <p className="book-author-details">{t("byAuthor", { authors: authors.join(", ") })}</p>
          )}
          <p className="book-desc-details">{desc}</p>
        </div>
      </div>
    </div>
  );
}





