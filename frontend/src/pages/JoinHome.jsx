// src/pages/JoinHome.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import codeImg from "../images/numpad.png";     // se quiseres manter a mesma imagem
import "../JoinHome.css";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function JoinHome() {
  const [inviteKey, setInviteKey] = useState("");
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  function getCSRFToken() {
    return document.cookie.split("; ").find(row => row.startsWith("csrftoken="))?.split("=")[1];
  }

  const handleJoin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/backend/houses/join/",  // adapta a tua URL se necessário
        { code: inviteKey },
        {
          headers: {
            "X-CSRFToken": getCSRFToken(),
          },
          withCredentials: true,
        }
      );

      setMessage("Entraste com sucesso!");
      nav("/dashboard");
    } catch (error) {
      if (error.response && error.response.data) {
        const result = error.response.data;
        let errorMsg = "Erro ao entrar na casa.";
        if (typeof result === "object") {
          errorMsg = Object.values(result).flat().join(" ");
        }
        setMessage(errorMsg);
      } else {
        setMessage("Erro ao conectar ao servidor.");
      }
    }
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
