import { Link } from "react-router-dom";
import { useShelfStore } from "../store/shelfStore";
import toast from "react-hot-toast";

interface BookCardProps {
  title: string;
  author: string;
  year?: number;
  coverId?: number;
  bookKey: string;
}

export default function BookCard({ title, author, year, coverId, bookKey }: BookCardProps) {
  const addBook = useShelfStore((state) => state.addBook);
  const removeBook = useShelfStore((state) => state.removeBook);

  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  const handleAdd = (status: "want" | "reading" | "finished") => {
    const book = { key: bookKey, title, author, year, coverId };
    addBook(status, book);

    toast.success(
      (t) => (
        <span>
          Added to <b>{status}</b>
          <button
            onClick={() => {
              removeBook(status, bookKey);
              toast.dismiss(t.id);
            }}
            style={{ marginLeft: "10px", color: "red" }}
          >
            Undo
          </button>
        </span>
      ),
      { duration: 4000 }
    );
  };

  return (
    <div className="book-card">
      <Link to={`/book/${bookKey.replace("/works/", "")}`}>
        <img src={coverUrl} alt={title} />
        <h3>{title}</h3>
        <p>{author}</p>
        {year && <small>{year}</small>}
      </Link>

      <div className="buttons">
        <button onClick={() => handleAdd("want")}>Want</button>
        <button onClick={() => handleAdd("reading")}>Reading</button>
        <button onClick={() => handleAdd("finished")}>Finished</button>
      </div>
    </div>
  );
}