import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../image/logo2.png";
import styled from "styled-components";

const StyledHeader = styled.div`
  position: relative;
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
    font-weigth: bold;
    font-size: 12pt;
    &:hover {
      color: blue;
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

  function logout() {
    localStorage.removeItem("authToken");
    navigate("/");
  }

  return (
    <StyledHeader>
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
