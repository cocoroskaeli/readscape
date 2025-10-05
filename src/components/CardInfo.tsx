import { useTranslation } from "react-i18next";

export default function CardInfo() {
  const { t } = useTranslation();

  return (
    <section className="info-section">
      <h1 className="welcome-title">{t("welcomeTitle")}</h1> {/* Ова е над картичките */}
      <div className="info-cards-container">
        <div className="info-card">
          <h3>{t("card1Title")}</h3>
          <p>{t("card1Text")}</p>
        </div>
        <div className="info-card">
          <h3>{t("card2Title")}</h3>
          <p>{t("card2Text")}</p>
        </div>
        <div className="info-card">
          <h3>{t("card3Title")}</h3>
          <p>{t("card3Text")}</p>
        </div>
      </div>
    </section>
  );
}