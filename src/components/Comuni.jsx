import { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import styled from "styled-components";

const StyledComuni = styled.div`
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
    ${"" /* width: 40%; */}
  }
  .inputPage {
    width: 80px;
    margin-bottom: 3px;
  }
  ${
    "" /* .hidden {
    display: none;
  } */
  }
  .spinner {
    position: absolute;
    ${"" /* transform: translate(-50%, -50%); */}
    top: 50%;
    left: 50%;
  }
`;

export default function Comuni() {
  useEffect(() => {
    comuniList(0);
  }, []);
  const [comuni, setComuni] = useState([]);
  const [pagine, setPagine] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [maxPage, setMaxPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);

  function uploadComuni() {
    if (selectedFile) {
      setShowSpinner(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      fetch(`${process.env.REACT_APP_BACKEND}/uploadCsv/comuni`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      })
        .then((response) => {
          console.log(response.status);
          if (response.status === 201) {
            setShowSpinner(false);
            window.alert("Comuni Caricati Con Successo!");
            setSelectedFile(null);
            comuniList(0);
          } else {
            console.log("upload NO");
            throw new Error("errore nell'upload'");
          }
        })
        // .then(() => {

        // })
        .catch((err) => console.log("ERRORE!", err));
    }
  }

  const handleFileChange = (event) => {
    // Gestisci il cambiamento del file selezionato
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const comuniList = (page) => {
    fetch(`${process.env.REACT_APP_BACKEND}/comuni?page=${page}`, {
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
          throw new Error("errore nella fetch");
        }
      })
      .then((data) => {
        const totPagine = data.totalPages;
        setMaxPage(data.totalPages - 1);
        const array = [];
        for (let i = 0; i < totPagine && i <= 10; i++) {
          array.push(i);
        }
        setPagine(array);
        setComuni(data.content);
      })

      .catch((err) => console.log("ERRORE!", err));
  };

  function eliminaTutto() {
    const confirmDelete = window.confirm(
      "Sei sicuro di voler eliminare tutti i comuni?"
    );
    if (confirmDelete) {
      fetch(`${process.env.REACT_APP_BACKEND}/comuni/all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 204) {
            window.alert("Comuni Eliminati!");
            comuniList(0);
          } else {
            throw new Error("Network response was not 204");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  return (
    <StyledComuni className="d-flex flex-column align-items-center">
      {showSpinner && (
        <Spinner animation="border" role="status" className="spinner">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}

      <div className="d-flex align-items-center py-1">
        <h5 className="text-center mx-2">Carica comuni da file</h5>
        <div className="d-flex align-items-center my-2">
          <Form.Control
            type="file"
            onChange={handleFileChange}
            className="input-file"
          />
          {selectedFile != null && (
            <button
              className="btn btn-primary rounded-3 mx-4 text-nowrap"
              onClick={uploadComuni}
            >
              Carica File
            </button>
          )}
        </div>
        <button className="btn btn-danger mx-3" onClick={eliminaTutto}>
          ELIMINA TUTTO
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Progessivo Comune</th>
            <th scope="col">Denominazione</th>
          </tr>
        </thead>
        <tbody>
          {comuni.map((comune, i) => (
            <tr key={i}>
              <th scope="row">{comune.id}</th>
              <td>{comune.progressivoDelComune}</td>
              <td>{comune.denominazione}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pages text-center flex-grow-1 d-flex justify-content-center">
        {pagine.map((pagina, i) => (
          <span
            key={i}
            className="link"
            onClick={() => {
              comuniList(i);
            }}
          >
            {pagina}
          </span>
        ))}
        <span className="d-flex justify-content-center align-items-center">
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
              comuniList(pageNumber);
            }}
          >
            Vai
          </button>
          <span className="mx-2">{`max ${maxPage}`}</span>
        </span>
      </div>
    </StyledComuni>
  );
}
