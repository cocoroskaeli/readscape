import ShelfCategory from "../components/ShelfCategory";
import { useShelfStore } from "../store/shelfStore";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function MyShelf() {
  const { shelf } = useShelfStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"want" | "reading" | "finished">("want");
  const tabs = ["want", "reading", "finished"] as const;

  return (
    <div className="p-4 center-container" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
      <h1 className="text-xl font-bold mb-4">{t("shelf")}</h1>
      <div className="shelf-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shelf-tab-btn${activeTab === tab ? " active" : ""}`}>
            {t(tab)}
          </button>
        ))}
      </div>
      {activeTab === "want" && (
        <ShelfCategory title={t("want")} books={shelf.want} activeTab="want" />
      )}
      {activeTab === "reading" && (
        <ShelfCategory title={t("reading")} books={shelf.reading} activeTab="reading" />
      )}
      {activeTab === "finished" && (
        <ShelfCategory title={t("finished")} books={shelf.finished} activeTab="finished" />
      )}
    </div>
  );
}

