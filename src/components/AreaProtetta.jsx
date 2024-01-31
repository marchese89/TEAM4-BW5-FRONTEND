import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledAreaProtetta = styled.div`
  ${"" /* height: 60%; */}
  .inner {
    background-color: grey;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    flex-direction: column;
    width: 100%;
    h3 {
      text-align: center;
    }
  }
  .nav {
    padding: 0;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-grow: 1;
    ul {
      padding: 0;
      background-color: cyan;
      width: 100%;
      flex-grow: 1;
      justify-content: center;
      margin-bottom: 0;
    }
    li {
      padding: 0.5em;
      color: white;
      &:hover {
        cursor: pointer;
      }
    }
    .selected {
      background-color: black;
    }
  }
`;

export default function AreaProtetta() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <StyledAreaProtetta>
      <div className="nav">
        <ul className="list-unstyled d-flex text-center">
          <li
            className={
              location.pathname === "/area_protetta/clienti" ? "selected" : ""
            }
            onClick={() => {
              navigate("./clienti");
            }}
          >
            Clienti
          </li>
          <li
            className={
              location.pathname === "/area_protetta/indirizzi" ? "selected" : ""
            }
          >
            Indirizzi
          </li>
          <li
            className={
              location.pathname === "/area_protetta/province" ? "selected" : ""
            }
            onClick={() => {
              navigate("./province");
            }}
          >
            Province
          </li>
          <li
            className={
              location.pathname === "/area_protetta/comuni" ? "selected" : ""
            }
          >
            Comuni
          </li>
          <li
            className={
              location.pathname === "/area_protetta/fatture" ? "selected" : ""
            }
          >
            Fatture
          </li>
          <li
            className={
              location.pathname === "/area_protetta/utenti" ? "selected" : ""
            }
          >
            Utenti
          </li>
        </ul>
      </div>
      {/* <div className="inner">
        <h3>Area protetta</h3>
      </div> */}
      <Outlet />
    </StyledAreaProtetta>
  );
}
