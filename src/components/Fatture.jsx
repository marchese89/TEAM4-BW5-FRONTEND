import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Form } from "react-router-dom";
import styled from "styled-components";


const StyledFatture = styled.div`

@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");


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

`;

export default function Fatture(){
  const [fattura, setFattura] = useState([]);
  const [show, setShow] = useState(false);
  const [nuovoStatoFattura, setNuovoStatoFattura] = useState("");
  const [selectedFattura, setSelectedFattura] = useState(null);

  const handleClose = () => {
    setNuovoStatoFattura("");
    setSelectedFattura(null);
    setShow(false);
  };

  const handleShow = () => setShow(true);

  /*const handleShow = (statoFattura, fattura) => {
    setNuovoStatoFattura(statoFattura);
    setSelectedFattura(fattura);
    setShow(true);
  }; */


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
          handleClose();
        } else {
          throw new Error("Errore durante l'aggiornamento dello stato della fattura");
        }
      })
      .catch((err) => {
        console.error("Errore durante la richiesta API:", err);
      });
  };

  useEffect(() => {
    handleSubmit();
  }, []);


    return(
<>

    <StyledFatture className="d-flex flex-column align-items-center">
      <div className="d-flex align-items-center py-1">
        <h5 className="text-center mx-2">Lista Fatture</h5>
      </div>
      <table className="table">
        <thead>
          <tr>
          <th scope="col">ID Cliente</th>
            <th scope="col">ID Fattura</th>
            <th scope="col">Data</th>
            <th scope="col">Numero</th>
            <th scope="col">Stato fattura</th>
          </tr>
        </thead>
        <tbody>
        
 { Array.isArray(Fatture)? (fattura.map((fattura, i)  => (
            <tr key={i}>
              <th scope="row">{fattura.idCliente}</th>
              <th scope="row">{fattura.id}</th>
              <th scope="row">{fattura.data}</th>
              <th scope="row">{fattura.numero}</th>
              <th scope="row">{fattura.statoFattura}
              <Button variant="primary" onClick={handleShow} /* onClick={() =>  handleShow(fattura.statoFattura, fattura)} */ >
        Modifica
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Stato fattura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {/* <Form.Select aria-label="Default select example"
         value={nuovoStatoFattura}
         onChange={(e) =>
           setNuovoStatoFattura(e.target.value)
         }
        >
      <option>Stati fatture</option>
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


        */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
 </th>
 </tr>

             
            
          ))
        ) : (
          <tr>
            <td colSpan="6">
              Fatture non disponibili
            </td>
          </tr>
        )}
        

         </tbody>
        </table>  
    </StyledFatture>
</>

    );
}



