import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";
import logo from "../images/logo.png";
import Form from "react-bootstrap/Form";
import { AuthContext } from "../store/Context";

import { useToast } from "@chakra-ui/react";

/** Icons Imports */
import { CiLogin } from "react-icons/ci";

function loginOnSubmit({ user, password }) {
  if (user === "admin" && password === "admin") {
    return { token: "1234" };
  }
  return { error: "Usuario ou Senha Invalido" };
}

export function Login() {
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();

  const handleSubmit = async (e) => {
    if (user == null || user == "") {
      toast({
        title: "Preencha o campo 'Usuário'",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });
      return;
    }
    if (password == null || password == "") {
      toast({
        title: "Preencha o campo 'Senha'",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });
      return;
    }
    await login(user, password)
      .then(() => {
        const nickname = localStorage.getItem("nickname");
        const message = `Bem vindo, ${nickname}.`;
        const status = "success";
        toast({
          title: message,
          status: status,
          duration: 3000,
          isClosable: true,
          position: "bottom-center",
        });
      })
      .catch((error) => {
        const message = error.response
          ? error.response.data.message
          : error.message;
        const status = error.response ? "error" : "warning";

        toast({
          title: message,
          status: status,
          duration: 3000,
          isClosable: true,
          position: "bottom-center",
        });
      });
  };

  function onChangeUser(event) {
    const { value } = event.target;
    setUser(value);
  }
  function onChangePassword(event) {
    const { value } = event.target;
    setPassword(value);
  }

  return (
    <div className="App" id="initial-page">
      <div className="card" id="initial-card">
        <img
          src={logo}
          className="card-img-left"
          id="logo-img"
          alt="Imobi logo"
        />
        <div className="card-body" method="">
          <h2 className="card-title">Login</h2>
          <p className="card-text">Realize o login para entrar na aplicação</p>
          <Form.Group className="mb-3" controlId="user">
            <Form.Label>Usuário:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome de usuário..."
              name="user"
              className="form-control"
              onChange={onChangeUser}
              value={user}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Senha:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite a senha..."
              name="password"
              className="form-control"
              onChange={onChangePassword}
              value={password}
              required
            />
          </Form.Group>

          <div>
            <button
              className="primary-button"
              type="submit"
              onClick={handleSubmit}
            >
              Entrar
              <CiLogin size={25} />
            </button>
            <button className="secundary-button">
              <Link to="/register">Registrar</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
