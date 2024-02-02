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
    text-align: start;
    color: #03989e;
  }
  .dettaglio {
    margin: 10px 0;
    padding-left: 1em;
  }

  .label {
    font-weight: bold;
    margin-right: 5px;
  }
  .btn-custom {
    background-color: white;
    border: 1px solid orange;
    color: orange;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 20px;
  }

  .btn-custom:hover {
    background-color: orange;
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
  .plus {
    margin-left: 10px;
    color: #03989e;
    &:hover {
      cursor: pointer;
    }
  }
  .address {
    /* background-color: lightblue; */
    padding: 0.8em 0;
    margin: 0.5em;
  }
  .addressRow {
    /* background-color: lightgrey;
    border-radius: 7px; */
    line-height: 1.5;
    padding: 10px;
  }
  .Col {
    padding: 20px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    line-height: 1.5;
    margin: 0 2em;
  }
  .btn-container {
    margin-top: 1.2em;
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
  const [indirizzo, setindirizzo] = useState({
    tipoIndirizzo: "SEDE_LEGALE",
  });
  const [province, setProvince] = useState([]);
  const [provincia, setProvincia] = useState("");
  const [comuni, setComuni] = useState([]);
  const [comune, setComune] = useState([]);
  const [modificaIndirizzo, setModificaIndirizzo] = useState(false);
  const [indirizzoId, setindirizzoId] = useState();

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
      .then((data) => {
        setIndirizzi(data);
        // console.log("indirizzi");
        // console.log(data);
      })
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

  // const handleShowModalIndirizzo = () => setShowModalIndirizzo(true);
  const handleCloseModalIndirizzo = () => setShowModalIndirizzo(false);

  const handleInputChange = (e) => {
    setClienteModificato({
      ...clienteModificato,
      [e.target.name]: e.target.value,
    });
  };
  const handleInputChangeIndirizzo = (e) => {
    setindirizzo({
      ...indirizzo,
      [e.target.name]: e.target.value,
      // idComune: comune,
      idCliente: idCliente,
    });
    if (
      indirizzo.tipoIndirizzo === null ||
      indirizzo.tipoIndirizzo === undefined
    ) {
      setindirizzo({
        ...indirizzo,
        tipoIndirizzo: "SEDE_LEGALE",
      });
    }
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
        // console.log("Dati aggiornati:", data);
        setCliente(data);
        handleCloseModal();
        caricaDettagliCliente();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function inserisciIndirizzo(event) {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_BACKEND}/indirizzi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(indirizzo),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          window.alert("Non puoi inserire due indirizzi con lo stesso tipo!");
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        handleCloseModalIndirizzo();
        getIndirizziCliente();
        setindirizzo({});
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

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

  const eliminaIndirizzo = (idIndirizzo) => {
    const confirmDelete = window.confirm(
      "Sei sicuro di voler eliminare questo indirizzo?"
    );
    if (confirmDelete) {
      fetch(`${process.env.REACT_APP_BACKEND}/indirizzi/${idIndirizzo}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 204) {
            getIndirizziCliente();
          } else {
            throw new Error("Network response was not 204");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  function getProvinciaByComune(idComune) {
    fetch(`${process.env.REACT_APP_BACKEND}/comuni/idProvincia/${idComune}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        setProvincia(data.id);
        getComuniByProvincia(data.id);
        setComune(idComune);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function modificaIndirizzoAction() {
    fetch(`${process.env.REACT_APP_BACKEND}/indirizzi/${indirizzoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(indirizzo),
    })
      .then((response) => {
        if (response.ok) {
          handleCloseModalIndirizzo();
          getIndirizziCliente();
          setindirizzo({});
        } else {
          window.alert("Ci sono stati problemi, indirizzo non modificato");
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  if (!cliente) {
    return (
      <StyledDettagliCliente>
        Caricamento dei dettagli del cliente...
      </StyledDettagliCliente>
    );
  }

  return (
    <StyledDettagliCliente>
      <div className="Row d-flex mt-4">
        <div className="Col ">
          <h2 className=" mb-4">Dettagli Cliente</h2>
          <div className="dettaglio">
            <span className="label">Ragione Sociale:</span>{" "}
            {cliente.ragioneSociale} {cliente.tipo}
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
            <span className="label">Email Titolare:</span>{" "}
            {cliente.emailContatto}
          </div>

          <div className="mt-3">
            <Button className="btn-custom m-2" onClick={handleShowModal}>
              Modifica
            </Button>
            <Button className="btn-danger-custom m-2" onClick={handleDelete}>
              Elimina
            </Button>
          </div>
        </div>
        <div className="Col ">
          <div className="d-flex align-items-center">
            <h2 className="mb-0 mr-2">Indirizzi Cliente</h2>
            <PlusCircle
              className="fs-3 plus"
              onClick={() => {
                setModificaIndirizzo(false);
                setShowModalIndirizzo(true);
              }}
            ></PlusCircle>
          </div>
          {indirizzi.map((indirizzo, i) => (
            <div key={i} className="address">
              <div className="addressRow">
                <strong>VIA:&nbsp;</strong>
                {indirizzo.via}
              </div>
              <div className="addressRow">
                <strong>Numero Civico:&nbsp;</strong>
                {indirizzo.numeroCivico}
              </div>
              <div className="addressRow">
                <strong>Località:&nbsp;</strong>
                {indirizzo.localita}
              </div>
              <div className="addressRow">
                <strong>CAP:&nbsp;</strong>
                {indirizzo.cap}
              </div>
              <div className="addressRow">
                <strong>Comune:&nbsp;</strong>
                {indirizzo.comune.denominazione}
              </div>
              <div className="addressRow">
                <strong>Tipo Indirizzo:&nbsp;</strong>
                {indirizzo.tipoIndirizzo}
              </div>
              <div className="btn-container d-flex justify-content-evenly p-1">
                <button
                  className="btn btn-custom"
                  onClick={() => {
                    setComune(indirizzo.comune.id);
                    getProvinciaByComune(indirizzo.comune.id);
                    // console.log("comune:" + indirizzo.comune.id);
                    setindirizzo({
                      via: indirizzo.via,
                      numeroCivico: indirizzo.numeroCivico,
                      localita: indirizzo.localita,
                      cap: indirizzo.cap,
                      tipoIndirizzo: indirizzo.tipoIndirizzo,
                      idComune: comune,
                      idCliente: idCliente,
                    });
                    setindirizzoId(indirizzo.id);
                    setShowModalIndirizzo(true);
                    setModificaIndirizzo(true);
                  }}
                >
                  Modifica
                </button>
                <button
                  className="btn btn-danger-custom"
                  onClick={() => {
                    eliminaIndirizzo(indirizzo.id);
                  }}
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* modale modifica cliente */}
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
      {/* modale indirizzo */}
      <Modal show={showModalIndirizzo} onHide={handleCloseModalIndirizzo}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modificaIndirizzo === false
              ? "Nuovo Indirizzo"
              : "Modifica Indirizzo"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Via</Form.Label>
              <Form.Control
                type="text"
                name="via"
                value={indirizzo.via || ""}
                onChange={handleInputChangeIndirizzo}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Numero Civico</Form.Label>
              <Form.Control
                type="text"
                name="numeroCivico"
                value={indirizzo.numeroCivico || ""}
                onChange={handleInputChangeIndirizzo}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Località</Form.Label>
              <Form.Control
                type="text"
                name="localita"
                value={indirizzo.localita || ""}
                onChange={handleInputChangeIndirizzo}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CAP</Form.Label>
              <Form.Control
                type="number"
                name="cap"
                maxLength={5}
                minLength={5}
                value={indirizzo.cap || ""}
                onChange={handleInputChangeIndirizzo}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Provincia</Form.Label>
              <Form.Select
                name="provincia"
                value={provincia}
                onChange={(e) => {
                  getComuniByProvincia(e.target.value);
                  setProvincia(e.target.value);
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
                name="idComune"
                value={comune}
                required
                onChange={(e) => {
                  setComune(e.target.value);
                  handleInputChangeIndirizzo(e);
                }}
              >
                <option></option>
                {comuni.map((comune, i) => (
                  <option value={comune.id} key={i}>
                    {comune.denominazione}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {modificaIndirizzo === false && (
              <Form.Select
                name="tipoIndirizzo"
                value={indirizzo.tipoIndirizzo}
                onChange={handleInputChangeIndirizzo}
              >
                <option>SEDE_LEGALE</option>
                <option>SEDE_OPERATIVA</option>
              </Form.Select>
            )}
            {modificaIndirizzo === true && (
              <div className="d-flex flex-column">
                <div>Tipo Indirizzo</div>
                <span>
                  <strong>{indirizzo.tipoIndirizzo}</strong>
                </span>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalIndirizzo}>
            Chiudi
          </Button>
          <Button
            variant="primary"
            onClick={
              modificaIndirizzo === false
                ? inserisciIndirizzo
                : modificaIndirizzoAction
            }
          >
            {modificaIndirizzo === false
              ? "Inserisci Indirizzo"
              : "Modifica Indirizzo"}
          </Button>
        </Modal.Footer>
      </Modal>
    </StyledDettagliCliente>
  );
}

export default DettagliCliente;
