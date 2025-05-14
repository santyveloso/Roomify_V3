import { useNavigate } from "react-router-dom";
import heroImg from "../images/hero-image.png";
import "../index.css";

export default function Onboarding() {
  const nav = useNavigate();

  return (
    <div className="onboarding-wrapper">
      <img
        src={heroImg}
        alt="Landing"
        className="onboard-img"
      />

      <h1 className="onboard-title">
        Mantém a casa como merece
      </h1>
      <p className="onboard-sub">
        Organize a sua casa de forma mais simples, com ajuda e sem stress!
      </p>

      <button
        className="primary-btn"
        onClick={() => nav("/create-or-join")}
      >
        Get started
      </button>
      <button
        className="link-btn"
        onClick={() => nav("/login")}
      >
        Sign in
      </button>
    </div>
  );
} 