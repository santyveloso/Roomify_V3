import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import codeImg from "../images/numpad.png";

function DashboardRoomieComp() {
  const [inviteKey, setInviteKey] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function getCSRFToken() {
    return document.cookie.split("; ").find(row => row.startsWith("csrftoken="))?.split("=")[1];
  }

  const handleJoin = async () => {
    try {
      await axios.post(
        "http://localhost:8000/backend/houses/join/",
        { code: inviteKey },
        {
          headers: { "X-CSRFToken": getCSRFToken() },
          withCredentials: true,
        }
      );

      const res = await axios.get("http://localhost:8000/backend/users/profile/", {
        withCredentials: true,
      });

      const casaId = res.data.house?.id;

      if (casaId) {
        navigate(`/houses/${casaId}/roomie`);
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
    <div className="create-home-wrapper">
      <h1 className="create-home-title">Dashboard do Roomie</h1>

      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <img
          src={codeImg}
          alt="Chave de convite"
          className="create-home-img"
        />

        <h2 className="create-home-sub">Insere o código para te juntares à tua casa</h2>

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

        <button className="primary-btn" onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}>
          Logout
        </button>

        {message && <p className="form-message">{message}</p>}
      </div>
    </div>
  );
}

export default DashboardRoomieComp;
