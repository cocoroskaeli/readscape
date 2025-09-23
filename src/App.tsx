import { Link, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

export default function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white">
      <nav className="flex items-center p-4 bg-gray-100 dark:bg-gray-900 shadow-md">
        <Link
          className="text-black dark:text-white mr-4 font-medium hover:underline"
          to="/"
        >
          {t("home")}
        </Link>
        <Link
          className="text-black dark:text-white font-medium hover:underline"
          to="/shelf"
        >
          {t("shelf")}
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => changeLanguage("en")}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage("es")}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ES
          </button>
          <ThemeToggle />
        </div>
      </nav>

      <Outlet />
      <Toaster position="bottom-right" />
    </div>
  );
}