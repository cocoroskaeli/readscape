import { useTranslation } from "react-i18next";
import "./SearchBar.css";
export default function CardInfo() {
  const { t } = useTranslation();

  return (
    <section className="info-section" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
      <h1 className="welcome-title">{t("welcomeTitle")}</h1> {/* Ова е над картичките */}
      <div className="info-cards-container" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
        <div className="info-card"  style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
          <h3>{t("card1Title")}</h3>
          <p>{t("card1Text")}</p>
        </div>
        <div className="info-card"  style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
          <h3>{t("card2Title")}</h3>
          <p>{t("card2Text")}</p>
        </div>
        <div className="info-card"  style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
          <h3>{t("card3Title")}</h3>
          <p>{t("card3Text")}</p>
        </div>
      </div>
    </section>
  );
}