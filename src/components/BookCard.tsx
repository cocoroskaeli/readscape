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
}

export default function BookCard({ title, author, year, coverId, bookKey }: BookCardProps) {
  const { t } = useTranslation();

  const addBook = useShelfStore((state) => state.addBook);
  const removeBook = useShelfStore((state) => state.removeBook);
  const lastAction = useShelfStore((state) => state.lastAction);

  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  const handleAdd = (status: "want" | "reading" | "finished") => {
    const book = { key: bookKey, title, author, year, coverId };
    addBook(status, book);

    if (lastAction === "exists") {
      toast.error(t("alreadyInShelf"));
    } else if (lastAction === "added") {
      toast.success(
        (tObj) => (
          <span>
            {t("addedTo")} <b>{t(status)}</b>
            <button
              onClick={() => {
                removeBook(status, bookKey);
                toast.dismiss(tObj.id);
              }}
              style={{ marginLeft: "10px", color: "red" }}
            >
              {t("undo")}
            </button>
          </span>
        ),
        { duration: 4000 }
      );
    }
  };

  return (
    <div className="book-card bg-white dark:bg-gray-700 text-black dark:text-white p-4 rounded shadow">
      <Link to={`/book/${bookKey.replace("/works/", "")}`}>
        <img src={coverUrl} alt={title} className="mb-2" />
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{author}</p>
        {year && <small>{year}</small>}
      </Link>

      <div className="buttons flex gap-2 mt-2">
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded dark:bg-blue-400"
          onClick={() => handleAdd("want")}
        >
          {t("want")}
        </button>
        <button
          className="px-2 py-1 bg-yellow-500 text-white rounded dark:bg-yellow-400"
          onClick={() => handleAdd("reading")}
        >
          {t("reading")}
        </button>
        <button
          className="px-2 py-1 bg-green-500 text-white rounded dark:bg-green-400"
          onClick={() => handleAdd("finished")}
        >
          {t("finished")}
        </button>
      </div>
    </div>
  );
}