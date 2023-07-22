import React, { useState } from "react";
import "../styles/styles.css";
import logo from "../images/logo.png";
import Form from "react-bootstrap/Form";
import InputMask from "react-input-mask";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

/** Icons Imports */
import { BiArrowBack } from "react-icons/bi";
import { createUser } from "../shared/services/imobiApi";

function initialState() {
  return {
    fullName: "",
    nickname: "",
    email: "",
    telephone: "",
    userLogin: "",
    password: "",
    confirmPassword: "",
  };
}

export function RegisterUser() {
  const navigate = useNavigate();
  const toast = useToast();
  const [values, setValues] = useState(initialState);

  function onChange(event) {
    const { value, name } = event.target;

    setValues({
      ...values,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    const companyId = localStorage.getItem('selectedCompanyId');
    const {
      fullName,
      nickname,
      email,
      telephone,
      userLogin,
      password,
      confirmPassword,
    } = values;

    if (
      (fullName || email || userLogin || password || confirmPassword) == null ||
      (fullName || email || userLogin || password || confirmPassword) == ""
    ) {
      toast({
        title: "Preencha todos os campos obrigatórios (*)",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });
      return;
    }

    if(password != confirmPassword){
        toast({
            title: "Senhas diferentes!",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "bottom-center",
          });
          return;
    }

    await createUser(
      fullName,
      userLogin,
      password,
      nickname,
      telephone,
      email,
      companyId
    )
      .then(() => {
        const message = `Usuário cadastrado com sucesso!`;
        const status = "success";
        toast({
          title: message,
          status: status,
          duration: 3000,
          isClosable: true,
          position: "bottom-center",
        });

        navigate("/login");
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

  return (
    <div className="App" id="initial-page">
      <div className="card" id="initial-card">
        <img
          src={logo}
          className="card-img-left"
          id="logo-img"
          alt="Imobi logo"
        />
        <button className="secundary-button" id="button-bottom-right">
          <Link to="/login">
            <BiArrowBack size={20} />
            Login
          </Link>
        </button>

        <div className="card-body" method="">
          <h4 className="card-title">Registrar usuário</h4>

          <div className="form-content">
            <Form.Group
              className="mb-3"
              controlId="fullName"
              style={{ marginRight: "10px", width: "50%" }}
            >
              <Form.Label>*Nome Completo:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome completo..."
                name="fullName"
                className="form-control"
                onChange={onChange}
                value={values.fullName}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="nickname"  style={{ width: "50%" }}>
              <Form.Label>Apelido:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o endereço do usuário..."
                name="nickname"
                className="form-control"
                onChange={onChange}
                value={values.nickname}
              />
            </Form.Group>
          </div>

          <div className="form-content">
            <Form.Group
              className="mb-3"
              controlId="telephone"
              style={{ marginRight: "10px", width: "50%" }}
            >
              <Form.Label>Telefone:</Form.Label>
              <InputMask
                mask="(99) 99999-9999"
                maskChar=""
                className="form-control"
                name="telephone"
                placeholder="(00) 00000-0000"
                type="text"
                onChange={onChange}
                value={values.telephone}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email"  style={{ width: "50%" }}>
              <Form.Label>*e-mail:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite o e-mail do usuário..."
                name="email"
                className="form-control"
                onChange={onChange}
                value={values.email}
              />
            </Form.Group>
          </div>
          <div className="form-content">
            <Form.Group className="mb-3" controlId="userLogin" style={{ width: "100%" }}>
              <Form.Label>*Usuário:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome completo..."
                name="userLogin"
                className="form-control"
                onChange={onChange}
                value={values.userLogin}
              />
            </Form.Group>
          </div>

          <div className="form-content">
            <Form.Group
              className="mb-3"
              controlId="password"
              style={{ marginRight: "10px", width: "50%" }}
            >
              <Form.Label>*Senha:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite o nome completo..."
                name="password"
                className="form-control"
                onChange={onChange}
                value={values.password}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword" style={{ width: "50%" }}>
              <Form.Label>*Confirmar Senha:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite o nome completo..."
                name="confirmPassword"
                className="form-control"
                onChange={onChange}
                value={values.confirmPassword}
              />
            </Form.Group>
          </div>

          <div>
            <button
              className="primary-button"
              type="submit"
              onClick={handleSubmit}
            >
              Cadastrar Usuário
            </button>
            <button className="secundary-button">
              <Link to="/register">Cancelar</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
