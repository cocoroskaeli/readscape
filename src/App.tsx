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
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <nav
        className="flex items-center p-4 shadow-md"
        style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
      >
        <Link className="mr-4 font-medium hover:underline" to="/?reset=true">
          {t("home")}
        </Link>
        <Link className="font-medium hover:underline" to="/shelf">
          {t("shelf")}
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => changeLanguage("en")}
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage("es")}
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
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
