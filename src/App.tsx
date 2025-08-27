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
      <nav className="bar">
        <Link className="nav text-black dark:text-white mr-4" to="/">
          {t("home")}
        </Link>
        <Link className="nav text-black dark:text-white" to="/shelf">
          {t("shelf")}
        </Link>

        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          <button onClick={() => changeLanguage("en")}>EN</button>
          <button onClick={() => changeLanguage("es")}>ES</button>
          <ThemeToggle />
        </div>
      </nav>

      <Outlet />
      <Toaster position="bottom-right" />
    </div>
  );
}