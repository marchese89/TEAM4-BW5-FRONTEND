import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "bootstrap-icons/font/bootstrap-icons.css";

const StyledClienti = styled.div`
  height: 100%;
  .link {
    padding: 0 1em;
    border-radius: 20px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      cursor: pointer;
      background-color: white;
      font-weight: bold;
      border: 1px solid #03989e;
      color: #03989e;
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
  .inputPage {
    width: 80px;
    margin-bottom: 3px;
  }

  .btn-custom:hover {
    background-color: #03989e;
    color: white;
  }
  .lista {
    color: #03989e;
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
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("");
  const [showFiltroModal, setShowFiltroModal] = useState(false);
  const [filtroFatturato, setFiltroFatturato] = useState("");
  const [filtroDataInserimento, setFiltroDataInserimento] = useState("");
  const [filtroDataUltimoContatto, setFiltroDataUltimoContatto] = useState("");
  const [filtroParteDelNome, setFiltroParteDelNome] = useState("");
  const [greaterOrLess, setGreaterOrLess] = useState("greater");
  const [metodoFiltro, setMetodoFiltro] = useState("fatturato");
  const [pagine, setPagine] = useState([]);
  const [maxPage, setMaxPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(0);
  const [filterOn, setFilterOn] = useState(null);

  const handleNuovoCliente = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowFiltroModal(false);
  };

  const handleApriFiltroModal = () => {
    setFiltroDataInserimento("");
    setFiltroFatturato("");
    setFiltroDataUltimoContatto("");
    setFiltroParteDelNome("");
    setShowFiltroModal(true);
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

  const handleFilter = (e, page) => {
    e.preventDefault();
    setSortBy(null);
    setSortOrder(null);
    fetch(
      `${process.env.REACT_APP_BACKEND}/cliente/filtered?page=${page}&fatturatoAnnuale=${filtroFatturato}&greaterOrLess=${greaterOrLess}&dataInserimentoAfter=${filtroDataInserimento}&dataUltimoContattoAfter=${filtroDataUltimoContatto}&parteDelNome=${filtroParteDelNome}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.content)) {
          const totPagine = data.totalPages;
          setMaxPage(data.totalPages - 1);
          const array = [];
          for (let i = 0; i < totPagine && i <= 10; i++) {
            array.push(i);
          }
          setPagine(array);
          setClienti(data.content);

          handleCloseModal();
        } else {
          throw new Error("Invalid data structure");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSort = (column, page, order) => {
    setSortBy(column);
    setSortOrder(order);
    // setFilterOn(null);

    fetch(
      `${process.env.REACT_APP_BACKEND}/cliente/sorted?sortedBy=${column}&sortOrder=${order}&page=${page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.content)) {
          const totPagine = data.totalPages;
          setMaxPage(data.totalPages - 1);
          const array = [];
          for (let i = 0; i < totPagine && i <= 10; i++) {
            array.push(i);
          }
          setPagine(array);
          setClienti(data.content);
        } else {
          throw new Error("Invalid data structure");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const clientiList = (page) => {
    fetch(`${process.env.REACT_APP_BACKEND}/cliente?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.content)) {
          const totPagine = data.totalPages;
          setMaxPage(data.totalPages - 1);
          const array = [];
          for (let i = 0; i < totPagine && i <= 10; i++) {
            array.push(i);
          }
          setPagine(array);
          console.log(data);
          setClienti(data.content);
        } else {
          throw new Error("Invalid data structure");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    clientiList(0);
  }, []);

  return (
    <StyledClienti className="d-flex flex-column align-items-center">
      <div className="title d-flex ms-2">
        <h3 className="lista text-center me-3">Lista Clienti</h3>
        {/* <Button variant="primary" onClick={handleNuovoCliente} className="mb-3">
          Nuovo Cliente
        </Button> */}
        <i onClick={handleNuovoCliente} className="bi bi-person-plus-fill"></i>
        <i
          onClick={handleApriFiltroModal}
          className="bi bi-funnel-fill ms-auto"
        ></i>{" "}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">
              <span className="d-flex">
                Ragione Sociale/Provincia
                <i
                  className="bi bi-arrow-down ms-1"
                  onClick={() => handleSort("provincia", 0)}
                ></i>
              </span>
            </th>
            <th scope="col" className="text-center">
              Partita IVA
            </th>
            <th scope="col" className="text-center">
              Email
            </th>
            <th scope="col" className="text-center">
              <span className="d-flex">
                Fatturato Annuale
                <i
                  className="bi bi-arrow-down ms-1"
                  onClick={() => handleSort("fatturatoAnnuale", 0, "desc")}
                ></i>
                <i
                  className="bi bi-arrow-up"
                  onClick={() => {
                    handleSort("fatturatoAnnuale", 0, "asc");
                  }}
                ></i>
              </span>
            </th>
            <th scope="col" className="text-center">
              <span className="d-flex">
                Inserimento
                <i
                  className="bi bi-arrow-down ms-1"
                  onClick={() => handleSort("dataInserimento", 0, "desc")}
                ></i>
                <i
                  className="bi bi-arrow-up"
                  onClick={() => {
                    handleSort("dataInserimento", 0, "asc");
                  }}
                ></i>
              </span>
            </th>
            <th scope="col" className="text-center">
              <span className="d-flex">
                Ultimo Contatto
                <i
                  className="bi bi-arrow-down ms-1"
                  onClick={() => handleSort("dataUltimoContatto", 0, "desc")}
                ></i>
                <i
                  className="bi bi-arrow-up"
                  onClick={() => {
                    handleSort("dataUltimoContatto", 0, "asc");
                  }}
                ></i>
              </span>
            </th>
            <th scope="col" className="text-center">
              <span className="d-flex">
                Titolare
                <i
                  className="bi bi-arrow-down ms-1"
                  onClick={() => handleSort("nomeContatto", 0, "asc")}
                ></i>
                <i
                  className="bi bi-arrow-up"
                  onClick={() => {
                    handleSort("nomeContatto", 0, "desc");
                  }}
                ></i>
              </span>
            </th>
            <th scope="col" className="text-center">
              Dettagli
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(clienti) ? (
            clienti.map((cliente, index) => (
              <tr key={index}>
                <td>{cliente.id}</td>
                <td>
                  {cliente.ragioneSociale}{" "}
                  {/* <div>
                    SEDE LEGALE:{" "}
                    {cliente.indirizzi &&
                    cliente.indirizzi.some(
                      (indirizzo) => indirizzo.tipoIndirizzo === "SEDE_LEGALE"
                    )
                      ? cliente.indirizzi.find(
                          (indirizzo) =>
                            indirizzo.tipoIndirizzo === "SEDE_LEGALE"
                        ).comune.provincia.sigla
                      : ""}
                  </div> */}
                </td>
                <td className="align-middle text-center">
                  {cliente.partitaIva}
                </td>
                <td className="align-middle text-center">{cliente.email}</td>
                <td className="align-middle text-center">
                  {cliente.fatturatoAnnuale}
                </td>
                <td className="align-middle text-center">
                  {cliente.dataInserimento}
                </td>
                <td className="align-middle text-center">
                  {cliente.dataUltimoContatto}
                </td>
                <td className="align-middle">
                  {cliente.nomeContatto} {cliente.cognomeContatto}
                </td>
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

      <Modal show={showFiltroModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filtri Clienti</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Seleziona Metodo di Filtro</Form.Label>
              <Form.Select
                name="metodoFiltro"
                value={metodoFiltro}
                onChange={(e) => setMetodoFiltro(e.target.value)}
              >
                <option value="fatturato">Fatturato</option>
                <option value="dataInserimento">Data Inserimento</option>
                <option value="dataUltimoContatto">Data Ultimo Contatto</option>
                <option value="parteDelNome">Parte del Nome</option>
              </Form.Select>
            </Form.Group>

            {metodoFiltro === "fatturato" && (
              <Form.Group className="mb-3">
                <Form.Label>Fatturato Annuale</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Select
                    name="fatturatoConfronto"
                    value={greaterOrLess}
                    onChange={(e) => setGreaterOrLess(e.target.value)}
                  >
                    <option value="greater">Maggiore di</option>
                    <option value="less">Minore di</option>
                  </Form.Select>
                  <Form.Control
                    type="number"
                    name="fatturatoAnnuale"
                    value={filtroFatturato}
                    onChange={(e) => setFiltroFatturato(e.target.value)}
                    className="me-2"
                  />
                </div>
              </Form.Group>
            )}

            {metodoFiltro === "dataInserimento" && (
              <Form.Group className="mb-3">
                <Form.Label>Data Inserimento Dopo</Form.Label>
                <Form.Control
                  type="date"
                  name="dataInserimentoAfter"
                  value={filtroDataInserimento}
                  onChange={(e) => setFiltroDataInserimento(e.target.value)}
                />
              </Form.Group>
            )}

            {metodoFiltro === "dataUltimoContatto" && (
              <Form.Group className="mb-3">
                <Form.Label>Data Ultimo Contatto Dopo</Form.Label>
                <Form.Control
                  type="date"
                  name="dataUltimoContattoAfter"
                  value={filtroDataUltimoContatto}
                  onChange={(e) => setFiltroDataUltimoContatto(e.target.value)}
                />
              </Form.Group>
            )}

            {metodoFiltro === "parteDelNome" && (
              <Form.Group className="mb-3">
                <Form.Label>Parte del Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="parteDelNome"
                  value={filtroParteDelNome}
                  onChange={(e) => setFiltroParteDelNome(e.target.value)}
                />
              </Form.Group>
            )}

            <Button
              variant="primary"
              type="submit"
              onClick={(e) => {
                handleFilter(e, 0);
                setFilterOn("on");
              }}
            >
              Filtra
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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

      <div className="pages text-center flex-grow-1 d-flex justify-content-center">
        {pagine.map((pagina, i) => (
          <span
            key={i}
            className="link"
            onClick={(e) => {
              // if (sortBy === null && filterOn === null) {
              //   clientiList(i);
              // } else if (sortBy !== null && filterOn === null) {
              //   handleSort(sortBy, i, sortOrder);
              // } else if (filterOn !== null) {
              //   handleFilter(e, i);
              // }
              if (sortBy != null) {
                handleSort(sortBy, i, sortOrder);
              } else if (filterOn !== null) {
                handleFilter(e, i);
              } else {
                clientiList(i);
              }
            }}
          >
            {pagina}
          </span>
        ))}
        {/* <span className="d-flex justify-content-center align-items-center">
          <Form.Control
            size="3"
            className="inputPage mx-2"
            value={pageNumber}
            onChange={(e) => {
              setPageNumber(e.target.value);
            }}
          ></Form.Control>
          <button
            className="btn btn-primary"
            onClick={() => {
              clientiList(pageNumber);
            }}
          >
            Vai
          </button>
          <span className="mx-2">{`max ${maxPage}`}</span>
        </span> */}
      </div>
    </StyledClienti>
  );
}
