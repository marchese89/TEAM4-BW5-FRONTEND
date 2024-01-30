import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledHeader = styled.div`
  background-color: lightgrey;
  position: relative;
  h1 {
    font-size: 3em;
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
`;

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <StyledHeader>
      <h1
        onClick={() => {
          navigate("/");
        }}
      >
        Azienda Energia
      </h1>
      <div
        className={
          location.pathname === "/" ? "login_register" : "login_register hidden"
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
    </StyledHeader>
  );
}
