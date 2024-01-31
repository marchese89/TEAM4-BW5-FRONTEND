import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const StyledDettagliCliente = styled.div`
  background-color: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  flex-direction: column;
  width: 60%;
  h2 {
    text-align: center;
  }
  .dettaglio {
    margin: 10px 0;
  }
`;

function DettagliCliente() {
  const [cliente, setCliente] = useState(null);
  const { idCliente } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3001/cliente/${idCliente}`, {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiaWF0IjoxNzA2NzAyMjM2LCJleHAiOjE3MDczMDcwMzZ9.X9DQyuCcs9Ie6_Vu-ai9Q70lAA-8G8b8i8NY1bAVPwM",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setCliente(data))
      .catch((error) => console.error("Error:", error));
  }, [idCliente]);

  if (!cliente) {
    return (
      <StyledDettagliCliente>
        Caricamento dei dettagli del cliente...
      </StyledDettagliCliente>
    );
  }

  return (
    <StyledDettagliCliente>
      <h2>Dettagli Cliente</h2>
      <div className="dettaglio">Ragione Sociale: {cliente.ragioneSociale}</div>
      <div className="dettaglio">Partita IVA: {cliente.partitaIva}</div>
      <div className="dettaglio">Email: {cliente.email}</div>
      <div className="dettaglio">
        Fatturato Annuale: {cliente.fatturatoAnnuale}
      </div>
      {/* Aggiungi qui altri campi del DTO che desideri visualizzare */}
    </StyledDettagliCliente>
  );
}

export default DettagliCliente;
