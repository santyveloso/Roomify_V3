import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateOrJoin() {
  const [tab, setTab] = useState("create");
  const navigate = useNavigate();

  return (
    <div className="create-or-join">
      <div className="tabs">
        <button onClick={() => setTab("create")}>Create Home</button>
        <button onClick={() => setTab("join")}>Join Home</button>
      </div>

      {tab === "create" ? (
        <div>
          <h2>Create a new home</h2>
          <button onClick={() => navigate("/create-home")}>Create new home</button>
        </div>
      ) : (
        <div>
          <h2>Enter your key to join an existing home</h2>
          <button onClick={() => navigate("/join-home")}>Join Home</button>
        </div>
      )}
    </div>
  );
}