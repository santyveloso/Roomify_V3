import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import codeImg from "../images/numpad.png";
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
      // 1. Tentar entrar na casa com o código
      await axios.post(
        "http://localhost:8000/backend/houses/join/",
        { code: inviteKey },
        {
          headers: { "X-CSRFToken": getCSRFToken() },
          withCredentials: true,
        }
      );

      // 2. Buscar o perfil atualizado (já deve incluir a casa associada)
      const res = await axios.get("http://localhost:8000/backend/users/profile/", {
        withCredentials: true,
      });

      const casaId = res.data.house?.id;

      if (casaId) {
        nav(`/houses/${casaId}`);
      } else {
        setMessage("Entraste, mas não conseguimos encontrar a casa associada.");
      }

    } catch (error) {
      if (error.response?.data) {
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

      <div className="create-home-wrapper">
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
          onChange={(e) => setInviteKey(e.target.value)}
          placeholder="Código de convite"
          className="form-input"
        />

        <button
          className="primary-btn"
          disabled={inviteKey.length === 0}
          onClick={handleJoin}
        >
          Entrar na Casa
        </button>

        {message && <p className="form-message">{message}</p>}
      </div>
    </>
  );
}
