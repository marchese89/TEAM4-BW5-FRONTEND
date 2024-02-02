import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styled from "styled-components";

const StyledProvince = styled.div`
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
`;

export default function Province() {
  useEffect(() => {
    provinceList(0);
  }, []);
  const [province, setProvince] = useState([]);
  const [pagine, setPagine] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  function uploadProvince() {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      fetch(`${process.env.REACT_APP_BACKEND}/uploadCsv/province`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      })
        .then((response) => {
          console.log(response.status);
          if (response.status === 201) {
            window.alert("Province Caricate Con Successo!");
            provinceList(0);
            setSelectedFile(null);
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

  const provinceList = (page) => {
    fetch(`${process.env.REACT_APP_BACKEND}/province?page=${page}`, {
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
        console.log(data);
        const totPagine = data.totalPages;
        const array = [];
        for (let i = 0; i < totPagine; i++) {
          array.push(i);
        }
        setPagine(array);
        setProvince(data.content);
      })

      .catch((err) => console.log("ERRORE!", err));
  };

  function eliminaTutto() {
    const confirmDelete = window.confirm(
      "Sei sicuro di voler eliminare tutte le province?"
    );
    if (confirmDelete) {
      fetch(`${process.env.REACT_APP_BACKEND}/province/all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 204) {
            window.alert("province Eliminate!");
            provinceList(0);
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
    <StyledProvince className="d-flex flex-column align-items-center">
      <div className="d-flex align-items-center py-1">
        <h5 className="text-center mx-2">Carica province da file</h5>
        <div className="d-flex align-items-center my-2">
          <Form.Control
            type="file"
            onChange={handleFileChange}
            className="input-file"
          />
          {selectedFile != null && (
            <button
              className="btn btn-primary rounded-3 mx-4 text-nowrap"
              onClick={uploadProvince}
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
            <th scope="col">Sigla</th>
            <th scope="col">Provincia</th>
            <th scope="col">Regione</th>
          </tr>
        </thead>
        <tbody>
          {province.map((provincia, i) => (
            <tr key={i}>
              <th scope="row">{provincia.id}</th>
              <td>{provincia.sigla}</td>
              <td>{provincia.provincia}</td>
              <td>{provincia.regione}</td>
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
              provinceList(i);
            }}
          >
            {pagina}
          </span>
        ))}
      </div>
    </StyledProvince>
  );
}
