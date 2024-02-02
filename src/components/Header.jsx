import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../image/logo2.png";
import sfondo from "../image/img-removebg.png";
import styled from "styled-components";

const StyledHeader = styled.div`
  position: relative;
  .backgroundImage {
    width: 100%;
    height: auto;
    position: absolute;
    z-index: -1;
    opacity: 0.8;
  }
  h1 {
    font-size: 2.5em;
    text-align: center;
    padding: 0.5em 0;
    color: blue;
    &:hover {
      cursor: pointer;
    }
    margin-bottom: 0;
  }
  .login_register {
    position: absolute;
    right: 1em;
    top: 0.5em;
  }
  .link {
    font-weight: bold;
    font-size: 12pt;
    &:hover {
      color: #03989e;
      cursor: pointer;
    }
  }
  .hidden {
    display: none;
  }
  .logout {
    position: absolute;
    right: 1em;
    top: 0.5em;
  }
  .logo {
    height: 80px;
  }
`;

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBackgroundImage, setShowBackgroundImage] = useState(true);

  useEffect(() => {
    // Determina se l'utente si trova in una delle sottopagine che richiedono di nascondere l'immagine di sfondo
    const hideBackgroundPages = [
      "/area_protetta/clienti",
      "/area_protetta/province",
      "/area_protetta/comuni",
    ];
    const shouldHideBackground = hideBackgroundPages.some((path) =>
      location.pathname.includes(path)
    );

    setShowBackgroundImage(!shouldHideBackground);
  }, [location.pathname]);

  function logout() {
    localStorage.removeItem("authToken");
    navigate("/");
  }

  return (
    <StyledHeader>
      {showBackgroundImage && (
        <img src={sfondo} alt="Background" className="backgroundImage" />
      )}
      <img
        src={logo}
        alt="Logo Azienda Energia"
        onClick={() => navigate("/")}
      />
      <div
        className={
          location.pathname === "/" &&
          localStorage.getItem("authToken") === null
            ? "login_register"
            : "login_register hidden"
        }
      >
        <span
          className="link"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </span>
        &nbsp;|&nbsp;
        <span
          className="link"
          onClick={() => {
            navigate("/register");
          }}
        >
          Registrati
        </span>
      </div>
      <div
        className={
          localStorage.getItem("authToken") !== null ? "logout" : "hidden"
        }
      >
        <span
          className="link"
          onClick={() => {
            navigate("area_protetta");
          }}
        >
          Area Protetta
        </span>
        &nbsp; | &nbsp;
        <span
          className="link"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </span>
      </div>
    </StyledHeader>
  );
}
