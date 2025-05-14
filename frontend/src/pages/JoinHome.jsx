// src/pages/JoinHome.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import codeImg from "../images/numpad.png";     // se quiseres manter a mesma imagem
import "../JoinHome.css";
import Navbar from "../components/Navbar";

export default function JoinHome() {
  const [inviteKey, setInviteKey] = useState("");
  const nav = useNavigate();

  const handleJoin = () => {
    // TODO: chamar a tua API para validar a inviteKey
    // e redirecionar para o Dashboard ou casa criada
    nav("/dashboard");
  };

  return (
    <>
      <Navbar />

      <div className="create-home-wrapper"> {/* reaproveita o wrapper do CreateHome */}
        <img
          src={codeImg}
          alt="Chave de convite"
          className="create-home-img"
        />

        <h1 className="create-home-title">
          Insere o teu código para te juntares a uma casa
        </h1>
        <p className="create-home-sub">
          Quando alguém te convida para uma casa do Roomify, a mensagem deve incluir um código único.
        </p>

        <input
          type="text"
          value={inviteKey}
          onChange={e => setInviteKey(e.target.value)}
          placeholder="Your key"
          className="form-input"   /* podes criar este estilo no teu CSS */
        />

        <button
          className="primary-btn"
          disabled={inviteKey.length === 0}
          onClick={handleJoin}
        >
          Join Home
        </button>
      </div>
    </>
  );
}
