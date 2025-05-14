import { useState } from "react";
import CreateHome from "../pages/CreateHome";
import JoinHome from "../pages/JoinHome";
import './HouseSwitcher.css';

export default function HouseSwitcher() {
  const [activeTab, setActiveTab] = useState("criar");

  return (
    <div className="house-switcher">
      <div className="switcher-buttons">
        <button
          className={activeTab === "criar" ? "active" : ""}
          onClick={() => setActiveTab("criar")}
        >
          Criar Casa
        </button>
        <button
          className={activeTab === "juntar" ? "active" : ""}
          onClick={() => setActiveTab("juntar")}
        >
          Juntar Casa
        </button>
      </div>

      <div className="form-container">
        {activeTab === "criar" ? <CreateHome /> : <JoinHome  />}
      </div>
    </div>
  );
}
