import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBookDetails, fetchAuthorName } from "../api";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);
  const [authors, setAuthors] = useState<string[]>([]);

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

  if (!book) {
    return <p>Loading ...</p>;
  }

  const coverId = book.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  return (
    <div
      className="p-4"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <h1 className="text-2xl font-bold">{book.title}</h1>
      <img src={coverUrl} alt={book.title} className="mb-4 w-48" />

      <p>
        {book.description
          ? typeof book.description === "string"
            ? book.description
            : book.description.value
          : "No description available."}
      </p>

      {authors.length > 0 && (
        <div>
          <h2 className="font-semibold mt-4">Authors:</h2>
          <ul>
            {authors.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}