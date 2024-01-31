import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
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
  const [showModal, setShowModal] = useState(false);
  const [clienteModificato, setClienteModificato] = useState({});
  const { idCliente } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (cliente) {
      setClienteModificato(cliente);
    }
  }, [cliente]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    setClienteModificato({
      ...clienteModificato,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:3001/cliente/${idCliente}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiaWF0IjoxNzA2NzAyMjM2LCJleHAiOjE3MDczMDcwMzZ9.X9DQyuCcs9Ie6_Vu-ai9Q70lAA-8G8b8i8NY1bAVPwM",
      },
      body: JSON.stringify(clienteModificato),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Dati aggiornati:", data);
        setCliente(data);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Sei sicuro di voler eliminare questo cliente?"
    );
    if (confirmDelete) {
      fetch(`http://localhost:3001/cliente/${idCliente}`, {
        method: "DELETE",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiaWF0IjoxNzA2NzAyMjM2LCJleHAiOjE3MDczMDcwMzZ9.X9DQyuCcs9Ie6_Vu-ai9Q70lAA-8G8b8i8NY1bAVPwM",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          navigate("/area_protetta/clienti");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

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
      <div className="dettaglio">
        Ragione Sociale: {cliente.ragioneSociale} {cliente.tipo}
      </div>
      <div className="dettaglio">Partita IVA: {cliente.partitaIva}</div>
      <div className="dettaglio">Email: {cliente.email}</div>
      <div className="dettaglio">
        Fatturato Annuale: {cliente.fatturatoAnnuale}
      </div>
      <div className="dettaglio">Pec: {cliente.pec}</div>
      <div className="dettaglio">
        Contatti: {cliente.telefono} {cliente.telefonoContatto}
      </div>
      <div className="dettaglio">
        Titolare azienda:{cliente.cognomeContatto} {cliente.nomeContatto}
      </div>
      <div className="dettaglio">Email Titolare: {cliente.emailContatto}</div>

      <div>
        <Button variant="primary" className="m-2" onClick={handleShowModal}>
          Modifica
        </Button>
        <Button variant="danger" className="m-2" onClick={handleDelete}>
          Elimina
        </Button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Ragione Sociale</Form.Label>
              <Form.Control
                type="text"
                name="ragioneSociale"
                value={clienteModificato.ragioneSociale || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Partita IVA</Form.Label>
              <Form.Control
                type="text"
                name="partitaIva"
                value={clienteModificato.partitaIva || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={clienteModificato.email || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fatturato Annuale</Form.Label>
              <Form.Control
                type="text"
                name="fatturatoAnnuale"
                value={clienteModificato.fatturatoAnnuale || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pec</Form.Label>
              <Form.Control
                type="text"
                name="pec"
                value={clienteModificato.pec || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contatti</Form.Label>
              <Form.Control
                type="text"
                name="contatti"
                value={clienteModificato.telefono || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nome Titolare</Form.Label>
              <Form.Control
                type="text"
                name="titolare"
                value={clienteModificato.nomeContatto || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cognome Titolare</Form.Label>
              <Form.Control
                type="text"
                name="titolare"
                value={clienteModificato.cognomeContatto || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email Titolare</Form.Label>
              <Form.Control
                type="text"
                name="titolare"
                value={clienteModificato.emailContatto || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Salva Modifiche
          </Button>
        </Modal.Footer>
      </Modal>
    </StyledDettagliCliente>
  );
}

export default DettagliCliente;
