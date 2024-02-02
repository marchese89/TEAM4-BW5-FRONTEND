import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Clienti from "./Clienti";


const StyledFatture = styled.div`



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

button {
    color : blue;
    background-color: white;
    border: none;
    font-size:10px;
    margin-left: 1em;
}

.nome{
  text-decoration: none;
  color: black;
}

`;

export default function Fatture(){
  const [fattura, setFattura] = useState([]);
  const [nuovaFattura, setNuovaFattura] = useState([]);
  const [nuovoStatoFattura, setNuovoStatoFattura] = useState([]);
  const [selectedFattura, setSelectedFattura] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [showOne, setShowOne] = useState(false);
  const [showTwo, setShowTwo] = useState(false);

  const handleCloseOne = () => setShowOne(false);
  const handleCloseTwo = () => setShowTwo(false);

  const handleShowOne = () => setShowOne(true);
  const handleShowTwo = () => setShowTwo(true);


  const handleInputChange = (e) => {
    setNuovaFattura({
      ...nuovaFattura,
      [e.target.name]: e.target.value,
    });
  };

  const creaFatturaAndClose =()=>{
    creaFattura();
    handleCloseOne();
  }

  const handleSaveAndClose = () => {
    handleSave();
    handleCloseTwo();
  };


  const {idCliente} = useParams()

  const getCliente = (event) => {
    if (event) {
      event.preventDefault();
    }
  
    fetch(`${process.env.REACT_APP_BACKEND}/fatture/getByIdCliente/${idCliente}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("errore");
        }
      })
      .then((datas) => {
        console.log("data", datas);
        if (datas && Array.isArray(datas.content)) {
          setFattura(datas.content);
      }})
      .catch((err) => {
        console.log("errore", err);
      });
  };


  const creaFattura = (event) => {
    if (event) {
      event.preventDefault();
    }
  
    fetch(`${process.env.REACT_APP_BACKEND}/fatture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...nuovaFattura}),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("errore");
        }
      })
      .then((data) => {
        console.log("data", data);
        if (data && Array.isArray(data.content)) {
          setFattura(data.content);
        }
      })
      .catch((err) => {
        console.log("errore", err);
      });
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
  
    fetch(`${process.env.REACT_APP_BACKEND}/fatture`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("errore");
        }
      })
      .then((data) => {
        console.log("data", data);
        if (data && Array.isArray(data.content)) {
          setFattura(data.content);
      }})
      .catch((err) => {
        console.log("errore", err);
      });
  };


  const handleSave = () => {
    if (!selectedFattura) {
      console.error("Nessuna fattura selezionata.");
      return;
    }
  
    console.log("Valore nuovoStatoFattura:", nuovoStatoFattura);

  
    fetch(`${process.env.REACT_APP_BACKEND}/fatture/${selectedFattura.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nuovoStatoFattura: nuovoStatoFattura,
      }),
    })
      .then((res) => {
        if (res.ok) {
          const updatedFattura = { ...selectedFattura, statoFattura: nuovoStatoFattura };
          const updatedFatture = fattura.map((f) =>
            f.id === selectedFattura.id ? updatedFattura : f
          );
          setFattura(updatedFatture);
        } else {
          throw new Error("Errore durante l'aggiornamento dello stato della fattura");
        }
      })
      .catch((err) => {
        console.error("Errore durante la richiesta API:", err);
      })
      .finally(() => {
        handleCloseTwo(); 
      });
  };




  useEffect(() => {
    handleSubmit();
  }, []);


  return (
    <>
      <StyledFatture className="d-flex flex-column align-items-center">

        <div className="d-flex align-items-center py-1">
          <h5 className="text-center mx-2">Lista Fatture</h5>

        <Button variant="primary"  onClick={handleShowOne}>
        Inserisci una nuova fattura
      </Button>
        </div>



        <Modal show={showOne} onHide={handleCloseOne}>
        <Modal.Header closeButton>
          <Modal.Title>Nuova fattura</Modal.Title>
        </Modal.Header>
        <Modal.Body>

            <Form.Group className="mb-3" onSubmit={handleSubmit}>
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="text"
                name="data"
                value={fattura.data}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Importo</Form.Label>
              <Form.Control
                type="number"
                name="importo"
                value={fattura.importo}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Numero</Form.Label>
              <Form.Control
                type="number"
                name="numero"
                value={fattura.numero}
                onChange={handleInputChange}
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Stato fattura</Form.Label>
              <Form.Select
                name="stato"
                value={nuovaFattura}
                onChange={(e) => setNuovaFattura(e.target.value)}
              >
                <option value="">Seleziona lo stato fattura</option>
      <option value="1">BOZZA</option>
      <option value="2">DA APPROVARE</option>
      <option value="3">PAGATA</option>
      <option value="2">DA PAGARE</option>
      <option value="2">PAGATA PARZIALMENTE</option>
      <option value="2">IN RITARDO</option>
      <option value="2">ANNULLATA</option>
      <option value="2">IN LAVORAZIONE</option>
      <option value="2">IN SPEDIZIONE</option>
      <option value="2">ARCHIVIATA</option>
              </Form.Select>
            </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOne}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={creaFatturaAndClose}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>




        <table className="table">
          <thead>
            <tr>
              <th scope="col">Cliente</th>
              <th scope="col">ID Fattura</th>
              <th scope="col">Data</th>
              <th scope="col">Numero</th>
              <th scope="col">Stato fattura</th>
            </tr>
          </thead>
          <tbody>
            {fattura.map((fattura, i) => (
              <tr key={i}>
                <th scope="row">

                <Link className="nome" to={`../clienti/dettagli/${fattura.cliente.id}`}>
      {fattura.cliente.nomeContatto} {fattura.cliente.cognomeContatto}
    </Link>
                </th>
                <th scope="row">{fattura.id}</th>
                <th scope="row">{fattura.data}</th>
                <th scope="row">{fattura.numero}</th>
                <th scope="row">
                  {fattura.statoFattura}
                  <Button variant="primary" onClick={() => handleShowTwo(fattura.id)}>
                    Modifica
                  </Button>

                </th>
                             </tr>
           ))} 

          </tbody>
        </table>

      <Modal show={showTwo} onHide={handleCloseTwo}>
        <Modal.Header closeButton>
          <Modal.Title>Stato fattura</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <Form.Select aria-label="Default select example"
  value={nuovoStatoFattura}
  onChange={(e) => setNuovoStatoFattura(e.target.value)}
        >
  <option value="" disabled>
    Seleziona uno stato
  </option>
      <option value="1">BOZZA</option>
      <option value="2">DA APPROVARE</option>
      <option value="3">PAGATA</option>
      <option value="2">DA PAGARE</option>
      <option value="2">PAGATA PARZIALMENTE</option>
      <option value="2">IN RITARDO</option>
      <option value="2">ANNULLATA</option>
      <option value="2">IN LAVORAZIONE</option>
      <option value="2">IN SPEDIZIONE</option>
      <option value="2">ARCHIVIATA</option>

       </Form.Select> 
 



        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTwo}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleSaveAndClose}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>

      </StyledFatture>
    </>
  );
}



