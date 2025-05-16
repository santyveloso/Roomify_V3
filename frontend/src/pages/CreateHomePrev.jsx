import { useNavigate } from "react-router-dom";
import keyImg from "../images/home-key.png";
import "../index.css";
import Navbar from "../components/Navbar";


export default function CreateHomePrev() {
  const nav = useNavigate();

  return (
      <> 
      <Navbar/>
    <div className="create-home-wrapper">
      <img
        src={keyImg}
        alt="Landing"
        className="create-home-img"
      />

      <h1 className="create-home-title">
        Criar Uma Nova Casa
      </h1>
      <p className="create-home-sub">
      Cria uma nova casa e convida os teus Roomies! 
      </p>

      <button
        className="primary-btn"
        onClick={() => nav("/criarcasa")}
      >
        Criar Nova Casa
      </button>
    </div>
    </>
  );
} 