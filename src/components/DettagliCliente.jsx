import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { PlusCircle } from "react-bootstrap-icons";
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
  }
  .dettaglio {
    margin: 10px 0;
  }

  .label {
    font-weight: bold;
    margin-right: 5px;
  }
  .plus {
    &:hover {
      cursor: pointer;
    }
  }
`;

function DettagliCliente() {
  const [cliente, setCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clienteModificato, setClienteModificato] = useState({});
  const { idCliente } = useParams();
  const [indirizzi, setIndirizzi] = useState([]);
  const navigate = useNavigate();
  const [showModalIndirizzo, setShowModalIndirizzo] = useState(false);
  const [nuovoIndirizzo, setNuovoIndirizzo] = useState({});
  const [province, setProvince] = useState([]);
  const [comuni, setComuni] = useState([]);
  const [comune, setComune] = useState([]);

  useEffect(() => {
    getProvince();
  }, []);

  function getProvince() {
    fetch(`${process.env.REACT_APP_BACKEND}/province/noPage`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProvince(data);
      })
      .catch((error) => console.error("Error:", error));
  }

  function getComuniByProvincia(provincia) {
    fetch(`${process.env.REACT_APP_BACKEND}/comuni/byProvincia/${provincia}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setComuni(data);
      })
      .catch((error) => console.error("Error:", error));
  }

  const getIndirizziCliente = () => {
    fetch(
      `${process.env.REACT_APP_BACKEND}/indirizzi/getByIdCliente/${idCliente}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setIndirizzi(data))
      .catch((error) => console.error("Error:", error));
  };

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
    getIndirizziCliente();
  }, [idCliente]);

  useEffect(() => {
    if (cliente) {
      setClienteModificato(cliente);
    }
  }, [cliente]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModalIndirizzo = () => setShowModalIndirizzo(true);
  const handleCloseModalIndirizzo = () => setShowModalIndirizzo(false);

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
        <Button variant="success" className="m-2" onClick={handleShowModal}>
          Modifica
        </Button>
        <Button variant="danger" className="m-2" onClick={handleDelete}>
          Elimina
        </Button>
      </div>
      <h4>Indirizzi Cliente</h4>
      <PlusCircle
        className="fs-3 plus"
        onClick={() => {
          setShowModalIndirizzo(true);
        }}
      ></PlusCircle>
      {indirizzi.map((indirizzo, i) => (
        <tr key={i}>
          <th scope="row">{indirizzo.id}</th>
          <td>{indirizzo.sigla}</td>
          <td>{indirizzo.provincia}</td>
          <td>{indirizzo.regione}</td>
        </tr>
      ))}

      <Modal show={showModal} onHide={handleCloseModalIndirizzo}>
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
          <Button variant="secondary" onClick={handleCloseModalIndirizzo}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Salva Modifiche
          </Button>
        </Modal.Footer>
      </Modal>
      {/* modale indirizzo */}
      <Modal show={showModalIndirizzo} onHide={handleCloseModalIndirizzo}>
        <Modal.Header closeButton>
          <Modal.Title>Nuovo Indirizzo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Via</Form.Label>
              <Form.Control
                type="text"
                name="via"
                value={nuovoIndirizzo.via || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Numero Civico</Form.Label>
              <Form.Control
                type="text"
                name="numero_civico"
                value={nuovoIndirizzo.numeroCivico || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Località</Form.Label>
              <Form.Control
                type="text"
                name="localita"
                value={nuovoIndirizzo.localita || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CAP</Form.Label>
              <Form.Control
                type="number"
                name="cap"
                maxLength={5}
                minLength={5}
                value={nuovoIndirizzo.cap || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Provincia</Form.Label>
              <Form.Select
                name="provincia"
                // value={provinciaSelezionata}
                onChange={(e) => {
                  getComuniByProvincia(e.target.value);
                }}
              >
                <option></option>
                {province.map((provincia, i) => (
                  <option value={provincia.id} key={i}>
                    {provincia.provincia}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comune</Form.Label>
              <Form.Select
                name="comune"
                // value={comune}
                onChange={(e) => {
                  setComune(e.target.value);
                }}
              >
                {comuni.map((comune, i) => (
                  <option value={comune.id} key={i}>
                    {comune.denominazione}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Select
              name="tipo_indirizzo"
              value={nuovoIndirizzo.tipoIndirizzo}
              onChange={handleInputChange}
            >
              <option>SEDE_LEGALE</option>
              <option>SEDE_OPERATIVA</option>
            </Form.Select>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalIndirizzo}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Inserisci Indirizzo
          </Button>
        </Modal.Footer>
      </Modal>
    </StyledDettagliCliente>
  );
}

export default DettagliCliente;
