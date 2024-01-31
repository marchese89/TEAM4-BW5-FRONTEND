import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledAreaProtetta = styled.div`
  .inner {
    background-color: grey;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    flex-direction: column;
    width: 60%;
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
  }
`;

export default function AreaProtetta() {
  const navigate = useNavigate();
  return (
    <StyledAreaProtetta>
      <div className="nav">
        <ul className="list-unstyled d-flex text-center">
          <li
            onClick={() => {
              navigate("./clienti");
            }}
          >
            Clienti
          </li>
          <li>Indirizzi</li>
          <li>Province</li>
          <li>Comuni</li>
          <li>Fatture</li>
        </ul>
      </div>
      <Outlet />
      <div className="inner">
        <h3>Area protetta</h3>
      </div>
    </StyledAreaProtetta>
  );
}
