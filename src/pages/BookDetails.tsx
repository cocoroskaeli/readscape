import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBookDetails, fetchAuthorName } from "../api";
import { useShelfStore } from "../store/shelfStore";
import toast from "react-hot-toast";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);
  const [authors, setAuthors] = useState<string[]>([]);
  const [rating, setRating] = useState(0);

  const addBook = useShelfStore((state) => state.addBook);
  const removeBook = useShelfStore((state) => state.removeBook);
  const lastAction = useShelfStore((state) => state.lastAction);
  const shelf = useShelfStore((state) => state.shelf);

  const isWanted = shelf.want.some((b) => b.key === id);
  const isReading = shelf.reading.some((b) => b.key === id);

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
    if (isWanted) {
      removeBook("want", id!);
      toast.success("Removed from Want to Read ♥");
    } else {
      addBook("want", { key: id!, title: book.title, author: authors.join(", "), coverId: book.covers?.[0] });
      toast.success("Added to Want to Read ♥");
    }
  };

  const handleReading = () => {
    addBook("reading", { key: id!, title: book.title, author: authors.join(", "), coverId: book.covers?.[0] });
    if (lastAction === "added") {
      toast.success("Added to Reading");
    } else if (lastAction === "exists") {
      toast.error("Already in shelf");
    }
  };

  const handleSetRating = (star: number) => {
    setRating(star);
    localStorage.setItem(`rating_${id}`, String(star));
    toast(`You rated this book ${star} star${star > 1 ? "s" : ""}!`);
  };

  if (!book) {
    return (
      <div className="center-container" style={{ minHeight: "340px" }}>
        <p>Loading ...</p>
      </div>
    );
  }

  let desc = "No description available.";
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
            aria-label="Toggle Want to Read"
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              zIndex: 2
            }}
          >
            ♥
          </button>
          <img src={coverUrl} alt={book.title} className="book-details-cover" />
          <button
            className={`btn-reading ${isReading ? "reading" : ""}`}
            onClick={handleReading}
            type="button"
            style={{ marginTop: "10px" }}
          >
            {isReading ? "Reading" : "Read"}
          </button>
          <div className="rating-stars" style={{ marginTop: "18px", display: "flex" }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`star ${num <= rating ? "filled" : ""}`}
                onClick={() => handleSetRating(num)}
                role="button"
                aria-label={`Rate ${num} star`}
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
            <p className="book-author-details">by {authors.join(", ")}</p>
          )}
          <p className="book-desc-details">{desc}</p>
        </div>
      </div>
    </div>
  );
}
