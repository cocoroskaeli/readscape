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
    <div className="app-container">
      {/* 🔹 CRN HEADER */}
      <nav className="header">
        <div className="header-left">
          <Link to="/?reset=true" className="logo">Readscape</Link>
        </div>

        <div className="header-right">
          <button onClick={() => changeLanguage("en")} className="lang-btn">EN</button>
          <button onClick={() => changeLanguage("es")} className="lang-btn">ES</button>
          <ThemeToggle />
        </div>
      </nav>

      {/* 🔹 HERO BAR (розево-кремав дел) */}
      <div className="hero-bar">
        <div className="hero-content">
          <div className="hero-links">
            <Link to="/?reset=true" className="hero-link">
              {t("home")}
            </Link>
            <Link to="/shelf" className="hero-link">
              {t("shelf")}
            </Link>
          </div>
          <div className="hero-search">
            {/* SearchBar ќе се прикажува во Home преку Outlet */}
            <Outlet context={{ showSearch: true }} />
          </div>
        </div>
      </div>

      {/* 🔹 MAIN CONTENT */}
      <main className="main-content">
        <Outlet />
      </main>

      <Toaster position="bottom-right" />
    </div>
  );
}