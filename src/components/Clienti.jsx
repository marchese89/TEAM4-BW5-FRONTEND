import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
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
  const [showModal, setShowModal] = useState(false);
  const [nuovoCliente, setNuovoCliente] = useState({
    ragioneSociale: "",
    partitaIva: "",
    email: "",
    fatturatoAnnuale: "",
    pec: "",
    telefono: "",
    emailContatto: "",
    nomeContatto: "",
    cognomeContatto: "",
    telefonoContatto: "",
    tipo: "",
  });
  const [tipo, setTipo] = useState("");

  const handleNuovoCliente = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setNuovoCliente({
      ...nuovoCliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_BACKEND}/cliente`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...nuovoCliente,
        tipo: tipo,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Nuovo cliente aggiunto:", data);
        setClienti([...clienti, data]);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/cliente`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
      <Button variant="primary" onClick={handleNuovoCliente} className="mb-3">
        Nuovo Cliente
      </Button>
      {Array.isArray(clienti) ? (
        <ul className="list-group">
          {clienti.map((cliente, index) => (
            <Link
              to={`/area_protetta/clienti/dettagli/${cliente.id}`}
              key={cliente.id}
              className="text-decoration-none"
            >
              <div>
                <li key={index} className="list-group-item">
                  <p>Ragione Sociale: {cliente.ragioneSociale}</p>
                  <p>Partita IVA: {cliente.partitaIva}</p>
                  <p>Email: {cliente.email}</p>
                  <p>Fatturato Annuale: {cliente.fatturatoAnnuale}</p>
                </li>
              </div>
            </Link>
          ))}
        </ul>
      ) : (
        <p>Nessun cliente disponibile o dati non corretti.</p>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nuovo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Ragione Sociale</Form.Label>
              <Form.Control
                type="text"
                name="ragioneSociale"
                value={nuovoCliente.ragioneSociale}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Partita IVA</Form.Label>
              <Form.Control
                type="text"
                name="partitaIva"
                value={nuovoCliente.partitaIva}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={nuovoCliente.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fatturato Annuale</Form.Label>
              <Form.Control
                type="text"
                name="fatturatoAnnuale"
                value={nuovoCliente.fatturatoAnnuale}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pec</Form.Label>
              <Form.Control
                type="text"
                name="pec"
                value={nuovoCliente.pec || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contatti</Form.Label>
              <Form.Control
                type="number"
                name="telefono"
                value={nuovoCliente.telefono || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nome Titolare</Form.Label>
              <Form.Control
                type="text"
                name="nomeContatto"
                value={nuovoCliente.nomeContatto || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cognome Titolare</Form.Label>
              <Form.Control
                type="text"
                name="cognomeContatto"
                value={nuovoCliente.cognomeContatto || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email Titolare</Form.Label>
              <Form.Control
                type="text"
                name="emailContatto"
                value={nuovoCliente.emailContatto || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                name="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="">Seleziona un tipo</option>
                <option value="PA">PA</option>
                <option value="SAS">SAS</option>
                <option value="SPA">SPA</option>
                <option value="SRL">SRL</option>
              </Form.Select>
            </Form.Group>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              className="me-2"
            >
              Chiudi
            </Button>
            <Button variant="primary" type="submit">
              Salva
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </StyledClienti>
  );
}
