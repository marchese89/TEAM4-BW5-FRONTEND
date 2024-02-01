import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const StyledDettagliCliente = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  flex-direction: column;
  width: 60%;
  h2 {
    text-align: center;
    color: #03989e;
  }
  .dettaglio {
    margin: 10px 0;
  }

  .label {
    font-weight: bold;
    margin-right: 5px;
  }
  .btn-custom {
    background-color: white;
    border: 1px solid #4caf50;
    color: #4caf50;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 20px;
  }

  .btn-custom:hover {
    background-color: #4caf50;
    color: white;
  }
  .btn-danger-custom {
    background-color: white;
    border: 1px solid #dc3545;
    color: #dc3545;
    border-radius: 20px;
  }

  .btn-danger-custom:hover {
    background-color: #dc3545;
    color: white;
  }
`;

function DettagliCliente() {
  const [cliente, setCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clienteModificato, setClienteModificato] = useState({});
  const { idCliente } = useParams();
  const navigate = useNavigate();

  const caricaDettagliCliente = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/cliente/${idCliente}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCliente(data))
      .catch((error) => console.error("Error:", error));
  };
  useEffect(() => {
    caricaDettagliCliente();
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
    fetch(`${process.env.REACT_APP_BACKEND}/cliente/${idCliente}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
        caricaDettagliCliente();
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
      fetch(`${process.env.REACT_APP_BACKEND}/cliente/${idCliente}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
      <h2 className="mt-2 mb-4">Dettagli Cliente</h2>
      <div className="dettaglio">
        <span className="label">Ragione Sociale:</span> {cliente.ragioneSociale}{" "}
        {cliente.tipo}
      </div>
      <div className="dettaglio">
        <span className="label">Partita IVA:</span> {cliente.partitaIva}
      </div>
      <div className="dettaglio">
        <span className="label">Email:</span> {cliente.email}
      </div>
      <div className="dettaglio">
        <span className="label">Fatturato Annuale:</span>{" "}
        {cliente.fatturatoAnnuale}
      </div>
      <div className="dettaglio">
        <span className="label">Pec:</span> {cliente.pec}
      </div>
      <div className="dettaglio">
        <span className="label">Contatti:</span> {cliente.telefono}{" "}
        {cliente.telefonoContatto}
      </div>
      <div className="dettaglio">
        <span className="label">Titolare azienda:</span>{" "}
        {cliente.cognomeContatto} {cliente.nomeContatto}
      </div>
      <div className="dettaglio">
        <span className="label">Email Titolare:</span> {cliente.emailContatto}
      </div>

      <div className="mt-3">
        <Button className="btn-custom m-2" onClick={handleShowModal}>
          Modifica
        </Button>
        <Button className="btn-danger-custom m-2" onClick={handleDelete}>
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
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="number"
                name="telefono"
                value={clienteModificato.telefono || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nome Titolare</Form.Label>
              <Form.Control
                type="text"
                name="nomeContatto"
                value={clienteModificato.nomeContatto || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cognome Titolare</Form.Label>
              <Form.Control
                type="text"
                name="cognomeContatto"
                value={clienteModificato.cognomeContatto || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email Titolare</Form.Label>
              <Form.Control
                type="text"
                name="emailContatto"
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
