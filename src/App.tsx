import { Link, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./components/ThemeToggle";
import SearchBar from "./components/SearchBar";
import { useState } from "react";
import "./App.css";

export default function App() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const location = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // ❌ скриј SearchBar ако си на /shelf или /book/...
  const hideSearch =
    location.pathname.startsWith("/shelf") ||
    location.pathname.startsWith("/book");

  return (
    <div className="app-container">
      {/* Header */}
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

      {/* Hero bar */}
      <div className="hero-bar">
        <div className="hero-content">
          <div className="hero-links">
            <Link to="/?reset=true" className="hero-link">{t("home")}</Link>
            <Link to="/shelf" className="hero-link">{t("shelf")}</Link>
          </div>
          <div className="hero-search">
            {/* ✅ SearchBar ќе се прикаже само ако не сме на shelf или book */}
            {!hideSearch && (
              <SearchBar onSearch={setQuery} initialValue={query} />
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="main-content">
        <Outlet context={{ query }} />
      </main>

      <Toaster position="bottom-right" />
    </div>
  );
}
