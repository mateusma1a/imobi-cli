import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import logo from "../images/logo.png";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { useToast, Select } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

/** components */
import SpinnerUtil from "../components/spinner-util/SpinnerUtil";

/** APIs */
import { getAllCompanies } from "../shared/services/imobiApi";

/** Icons Imports */
import { GrFormNextLink } from "react-icons/gr";
import { MdDomainAdd } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";

export function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [loading, setLoading] = useState(true);

  async function onInit() {
    setCompanies([]);
    const response = await getAllCompanies().catch((error) => {
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

    if (response === undefined) {
      navigate("/register-company");
      setLoading(false);
      return;
    }

    const companiesResponse = response.data.result;
    setCompanies(companiesResponse);
    setLoading(false);
  }

  function handleSelectChange(event) {
    const { value } = event.target;
    setSelectedCompanyId(value);
  }

  const handleSubmit = () => {
    if (selectedCompanyId == null || selectedCompanyId == "") {
      toast({
        title: "Selecione a empresa antes de continuar!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });
      return;
    }

    localStorage.setItem("selectedCompanyId", selectedCompanyId);
    navigate("/register-user");
  };

  useEffect(() => {
    onInit();
  }, []);

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
          <h5 className="card-title">
            Selecione a empresa do usuário a ser cadastrado.
          </h5>
          <Select
            placeholder="Selecione a empresa"
            value={selectedCompanyId}
            onChange={handleSelectChange}
          >
            {companies.map((company) => (
              <option key={company.company_name} value={company.id}>
                {company.company_name}
              </option>
            ))}
          </Select>

          <div>
            <button
              className="primary-button"
              type="submit"
              onClick={handleSubmit}
            >
              Continue
              <GrFormNextLink size={25} color="#ffff" />
            </button>
            <button className="secundary-button">
              <Link to="/register-company">
                Cadastrar Nova Empresa
                <MdDomainAdd size={25} />
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
