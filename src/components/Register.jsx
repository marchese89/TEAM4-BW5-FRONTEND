import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import styled from "styled-components";

const StyledRegister = styled.div`
  background-color: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  flex-direction: column;
  width: 60%;
  h3 {
    text-align: center;
  }
`;

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [role, setRole] = useState("USER");

  function registraUtente() {
    fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        nome: nome,
        cognome: cognome,
        role: role,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setUsername("");
          setEmail("");
          setPassword("");
          setNome("");
          setCognome("");
          setRole("");
          window.alert("Registrazione Effettuata con successo!");
        } else {
          throw new Error("errore nella fetch");
        }
      })
      .catch((err) => console.log("ERRORE!", err));
  }

  return (
    <StyledRegister className="pb-4">
      <div className="inner">
        <h3>Registrati</h3>
        <form id="register-form">
          <InputGroup className="d-flex flex-column w-100">
            <Form.Label className="text-center fs-5">Username</Form.Label>
          </InputGroup>
          <Form.Control
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></Form.Control>
          <InputGroup className="d-flex flex-column w-100">
            <Form.Label className="text-center fs-5">Email</Form.Label>
          </InputGroup>
          <Form.Control
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></Form.Control>
          <InputGroup className="d-flex flex-column w-100">
            <Form.Label className="text-center fs-5">Password</Form.Label>
          </InputGroup>
          <Form.Control
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Form.Control>
          <InputGroup className="d-flex flex-column w-100">
            <Form.Label className="text-center fs-5">Nome</Form.Label>
          </InputGroup>
          <Form.Control
            required
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
            }}
          ></Form.Control>
          <InputGroup className="d-flex flex-column w-100">
            <Form.Label className="text-center fs-5">Cognome</Form.Label>
          </InputGroup>
          <Form.Control
            required
            value={cognome}
            onChange={(e) => {
              setCognome(e.target.value);
            }}
          ></Form.Control>
          <InputGroup className="d-flex flex-column w-100">
            <Form.Label className="text-center fs-5">Ruolo</Form.Label>
          </InputGroup>
          <Form.Select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <option>USER</option>
            <option>ADMIN</option>
          </Form.Select>
          <div className="text-center mt-3">
            <Button
              className="save-button rounded-5 px-3"
              onClick={registraUtente}
            >
              Registrati
            </Button>
          </div>
        </form>
      </div>
    </StyledRegister>
  );
}
