import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "bootstrap-icons/font/bootstrap-icons.css";

const StyledClienti = styled.div`
  height: 100%;
  .link {
    padding: 0 1em;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      cursor: pointer;
      color: red;
      background-color: blue;
    }
  }
  .pages {
    align-items: flex-end;
  }
  .input-file {
    width: 40%;
  }
  .inputPage {
    width: 80px;
    margin-bottom: 3px;
  }
  .title {
    justify-content: flex-start;
    width: -webkit-fill-available;
  }
  .bi {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: larger;
    cursor: pointer;
  }
  .btn-custom {
    background-color: white;
    border: 1px solid #03989e;
    color: #03989e;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 20px;
  }

  .btn-custom:hover {
    background-color: #03989e;
    color: white;
  }
  .lista {
    color: #7ed957;
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
        if (data && data.id) {
          const clienteAggiunto = {
            ...nuovoCliente,
            id: data.id,
          };
          setClienti((prevClienti) => [...prevClienti, clienteAggiunto]);
          handleCloseModal();
        } else {
          console.error("Dati del nuovo cliente incompleti!", data);
        }
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
    <StyledClienti className="d-flex flex-column align-items-center">
      <div className="title d-flex ms-2">
        <h3 className="lista text-center me-3">Lista Clienti</h3>
        {/* <Button variant="primary" onClick={handleNuovoCliente} className="mb-3">
          Nuovo Cliente
        </Button> */}
        <i onClick={handleNuovoCliente} className="bi bi-person-plus-fill"></i>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Ragione Sociale</th>
            <th scope="col">Partita IVA</th>
            <th scope="col">Email</th>
            <th scope="col">Fatturato Annuale</th>
            <th scope="col">Dettagli</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(clienti) ? (
            clienti.map((cliente, index) => (
              <tr key={index}>
                <td>{cliente.id}</td>
                <td>{cliente.ragioneSociale}</td>
                <td>{cliente.partitaIva}</td>
                <td>{cliente.email}</td>
                <td>{cliente.fatturatoAnnuale}</td>
                <td>
                  <Link
                    to={`/area_protetta/clienti/dettagli/${cliente.id}`}
                    className="btn btn-custom"
                  >
                    Dettagli
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">
                Nessun cliente disponibile o dati non corretti.
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
              <Form.Label>Telefono Titolare</Form.Label>
              <Form.Control
                type="text"
                name="telefonoContatto"
                value={nuovoCliente.telefonoContatto || ""}
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
