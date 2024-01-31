import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledClienti = styled.div`
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
`;
export default function Clienti() {
  const [clienti, setClienti] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/cliente", {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiaWF0IjoxNzA2NzAyMjM2LCJleHAiOjE3MDczMDcwMzZ9.X9DQyuCcs9Ie6_Vu-ai9Q70lAA-8G8b8i8NY1bAVPwM",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.content)) {
          setClienti(data.content);
        } else {
          throw new Error("Invalid data structure");
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <StyledClienti>
      <h3>Clienti</h3>

      {Array.isArray(clienti) ? (
        <ul className="list-group">
          {clienti.map((cliente, index) => (
            <li key={index} className="list-group-item">
              <p>Ragione Sociale: {cliente.ragioneSociale}</p>
              <p>Partita IVA: {cliente.partitaIva}</p>
              <p>Email: {cliente.email}</p>
              <p>Fatturato Annuale: {cliente.fatturatoAnnuale}</p>
              {/* Altri campi come necessario */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessun cliente disponibile o dati non corretti.</p>
      )}
    </StyledClienti>
  );
}
