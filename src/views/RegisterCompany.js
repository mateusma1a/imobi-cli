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
import { createCompany } from "../shared/services/imobiApi";

function initialState() {
  return { companyName: "", address: "", telephone: "", email: "" };
}

export function RegisterCompany() {
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
    const { companyName, address, email, telephone } = values;

    if (
      (companyName || email || telephone) == null ||
      (companyName || email || telephone) == ""
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

    await createCompany(1, companyName, address, email, telephone)
      .then(() => {
        const message = `Empresa cadastrada com sucesso!`;
        const status = "success";
        toast({
          title: message,
          status: status,
          duration: 3000,
          isClosable: true,
          position: "bottom-center",
        });

        navigate("/register");
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
          <h4 className="card-title">Registrar empresa</h4>
          <Form.Group className="mb-3" controlId="companyType">
            <Form.Label>*Tipo de empresa:</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Selecione o tipo da empresa</option>
              <option value="1">Imobiliária</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="companyName">
            <Form.Label>*Nome da empresa:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome da empresa..."
              name="companyName"
              className="form-control"
              onChange={onChange}
              value={values.companyName}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Endereço:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o endereço da empresa..."
              name="address"
              className="form-control"
              onChange={onChange}
              value={values.address}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="telephone">
            <Form.Label>*Telefone:</Form.Label>
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

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>*e-mail:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Digite o e-mail da empresa..."
              name="email"
              className="form-control"
              onChange={onChange}
              value={values.email}
            />
          </Form.Group>

          <div>
            <button
              className="primary-button"
              type="submit"
              onClick={handleSubmit}
            >
              Cadastrar Empresa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
