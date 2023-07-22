import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import Form from "react-bootstrap/Form";
import { InputGroup } from "react-bootstrap";
import CurrencyInputField from "react-currency-input-field";
import mapBox from "mapbox-gl";

import { CustomNav } from "../components/custom-nav/CustomNav";
import { Header } from "../components/Header";

import { BsBuildingFillAdd } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import { IconButton, useToast, Select } from "@chakra-ui/react";
import { getAddressSuggestions } from "../shared/services/mapBoxApi";
import { createBuilding } from "../shared/services/imobiApi";

function initialState() {
  return {
    registration: "",
    state: "",
    city: "",
    neighborhood: "",
    street: "",
    numberAddress: "",
    address: "",
    lat: null,
    long: null,
  };
}

export function BuildingRegister() {
  const [values, setValues] = useState(initialState);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [buildingType, setBuildingType] = useState("");
  const [statusBuilding, setStatusBuilding] = useState("");

  const [evaluationValue, setEvaluationValue] = useState("");
  const [acquisitionValue, setAcquisitionValue] = useState("");
  const [rentValue, setRentValue] = useState("");
  const [saleValue, setSaleValue] = useState("");

  const navigate = useNavigate();
  const toast = useToast();
  let addressSuggestions = [];

  function handleEvaluationValueChange(event) {
    const { value } = event.target;
    var stringNumber = value.replace("R$", "");
    var newValue = parseFloat(stringNumber.replace(",", "."));
    setEvaluationValue(newValue);
  }

  function handleAcquisitionValueChange(event) {
    const { value } = event.target;
    setAcquisitionValue(value);
  }

  function handleRentValueChange(event) {
    const { value } = event.target;
    setRentValue(value);
  }

  function handleSaleValueChange(event) {
    const { value } = event.target;
    setSaleValue(value);
  }

  function handleBuildingTypeChange(event) {
    const { value } = event.target;
    setBuildingType(value);
  }

  function handleStatusBuildingChange(event) {
    const { value } = event.target;
    setStatusBuilding(value);
  }

  function onChange(event) {
    const { value, name } = event.target;

    setValues({
      ...values,
      [name]: value,
    });

    const { address } = values;
    if (name === "address" && (address.length == 5 || address.length == 10)) {
      handleSearchAddress();
    }
  }

  var mapboxgl = mapBox;
  mapboxgl.accessToken =
    process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ||
    "not found environment variable REACT_APP_MAPBOX_ACCESS_TOKEN";

  useEffect(() => {
    if (map === null) {
      setMap(
        new mapboxgl.Map({
          container: "map-box",
          style: "mapbox://styles/mapbox/streets-v11",
          center: [-43.9542, -19.8157],
          zoom: 5,
        })
      );
    }
  }, []);

  useEffect(() => {
    const { long, lat } = values;
    if (marker !== null) {
      marker.remove();
    }

    if (
      (long && lat) !== null &&
      (long && lat) !== undefined &&
      (long && lat) !== ""
    ) {
      setMarker(new mapboxgl.Marker().setLngLat([long, lat]).addTo(map));

      map.setZoom(15);
      map.setCenter([long, lat]);
    }
  }, [values.long, values.lat]);

  const handleSearchAddress = async () => {
    const { state, city, neighborhood, street, numberAddress } = values;
    if (
      state == null ||
      state == "" ||
      state == undefined ||
      city == null ||
      city == "" ||
      city == undefined ||
      neighborhood == null ||
      neighborhood == "" ||
      neighborhood == undefined ||
      street == null ||
      street == "" ||
      street == undefined ||
      numberAddress == null ||
      numberAddress == "" ||
      numberAddress == undefined
    ) {
      toast({
        title:
          "Preencha todos os campo referente ao endereço antes de realizar a pesquisa!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });
      return;
    }

    const query = `${street}, ${numberAddress}, ${neighborhood}, ${city}, ${state}, Brasil`;
    const response = await getAddressSuggestions(query);
    addressSuggestions = response.data.features;

    if (addressSuggestions.length > 0) {
      setValues({
        ...values,
        ["address"]: addressSuggestions[0].place_name,
        ["long"]: addressSuggestions[0].center[0],
        ["lat"]: addressSuggestions[0].center[1],
      });

      map.setZoom(15);
      map.setCenter([
        addressSuggestions[0].center[0],
        addressSuggestions[0].center[1],
      ]);
    } else {
      toast({
        title: "Nenhum endereço encontrado!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });
      return;
    }
  };

  const handleRegisterBuilding = async () => {
    const {
      long,
      lat,
      registration,
      state,
      city,
      neighborhood,
      street,
      numberAddress,
      address,
    } = values;

    if (
      buildingType == null ||
      buildingType == "" ||
      buildingType == undefined ||
      registration == null ||
      registration == "" ||
      registration == undefined ||
      statusBuilding == null ||
      statusBuilding == "" ||
      statusBuilding == undefined
    ) {
      toast({
        title: "Preencha todos os campo obrigatórios (*).",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });
      return;
    }

    if (
      state == null ||
      state == "" ||
      state == undefined ||
      city == null ||
      city == "" ||
      city == undefined ||
      neighborhood == null ||
      neighborhood == "" ||
      neighborhood == undefined ||
      street == null ||
      street == "" ||
      street == undefined ||
      numberAddress == null ||
      numberAddress == "" ||
      numberAddress == undefined
    ) {
      toast({
        title: "Preencha todos os campo referente ao endereço.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });
      return;
    }

    if (
      (long && lat) == null ||
      (long && lat) == undefined ||
      (long && lat) == ""
    ) {
      await handleSearchAddress();

      toast({
        title: "verifique se o endreço está correto e tente novamente!",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });
      return;
    }

    const user = JSON.parse(window.localStorage.getItem("userData"));
    const currentDate = new Date();

    // Format the date in ISO format (suitable for database storage)
    const formattedDateForDatabase = formatDateForDatabase(currentDate);
    await createBuilding(
      registration,
      state,
      city,
      neighborhood,
      street,
      numberAddress,
      address,
      lat,
      long,
      buildingType,
      evaluationValue == "" ? "0" : evaluationValue,
      acquisitionValue == "" ? "0" : acquisitionValue,
      rentValue == "" ? "0" : rentValue,
      saleValue == "" ? "0" : saleValue,
      user.id,
      formattedDateForDatabase,
      null,
      user.companyId,
      statusBuilding
    )
      .then(() => {
        const message = `Imóvel cadastrado com sucesso!`;
        const status = "success";
        toast({
          title: message,
          status: status,
          duration: 3000,
          isClosable: true,
          position: "bottom-center",
        });

        navigate("/buildings-registered");
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

  function formatDateForDatabase(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1 and pad with leading zero if necessary
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <>
      <Header />
      <div className="full-content">
        <CustomNav />

        <div className="main-content">
          <div className="form-content">
            <Form.Group
              className="mb-3"
              controlId="buildingType"
              style={{ marginRight: "10px", width: "33%" }}
            >
              <Form.Label>*Tipo de imóvel:</Form.Label>
              <Select
                placeholder="Selecione o tipo do imovel"
                value={buildingType}
                onChange={handleBuildingTypeChange}
                style={{ backgroundColor: "white" }}
              >
                <option value="1">Apartamento</option>
                <option value="2">Casa Rural</option>
                <option value="3">Casa Urbana</option>
              </Select>
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="registration"
              style={{ marginRight: "10px", width: "33%" }}
            >
              <Form.Label>*Registro:</Form.Label>
              <Form.Control
                type="text"
                maxLength={20}
                placeholder="Digite o codigo de registro do imóvel..."
                name="registration"
                className="form-control"
                onChange={onChange}
                value={values.registration}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="statusBuilding"
              style={{ marginRight: "10px", width: "33%" }}
            >
              <Form.Label>*Status:</Form.Label>

              <Select
                placeholder="Selecione o status do imóvel"
                value={statusBuilding}
                onChange={handleStatusBuildingChange}
                style={{ backgroundColor: "white" }}
              >
                <option value="1">Disponível</option>
                <option value="2">Vendido</option>
                <option value="3">Alugado</option>
              </Select>
            </Form.Group>
          </div>

          <div className="form-content">
            <Form.Group
              className="mb-3"
              controlId="evaluationValue"
              style={{ marginRight: "10px", width: "25%" }}
            >
              <Form.Label>Valor de avaliação:</Form.Label>
              <Form.Control
                type="number"
                placeholder="R$"
                name="evaluationValue"
                className="form-control"
                onChange={handleEvaluationValueChange}
                value={evaluationValue}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="acquisitionValue"
              style={{ marginRight: "10px", width: "25%" }}
            >
              <Form.Label>Valor de aquisição:</Form.Label>
              <Form.Control
                type="number"
                placeholder="R$"
                name="acquisitionValue"
                className="form-control"
                onChange={handleAcquisitionValueChange}
                value={acquisitionValue}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="rentValue"
              style={{ marginRight: "10px", width: "25%" }}
            >
              <Form.Label>Valor de aluguel:</Form.Label>
              <Form.Control
                type="number"
                placeholder="R$"
                name="rentValue"
                className="form-control"
                onChange={handleRentValueChange}
                value={rentValue}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="saleValue"
              style={{ marginRight: "10px", width: "25%" }}
            >
              <Form.Label>Valor de venda:</Form.Label>
              <Form.Control
                type="number"
                placeholder="R$"
                name="saleValue"
                className="form-control"
                onChange={handleSaleValueChange}
                value={saleValue}
              />
            </Form.Group>
          </div>
          <div className="form-content-grid">
            <div id="map-box" className="register-building-map"></div>
            <Form.Group controlId="state" className="state">
              <Form.Label>*Estado:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a cidade."
                name="state"
                className="form-control"
                onChange={onChange}
                value={values.state}
              />
            </Form.Group>

            <Form.Group controlId="city" className="city">
              <Form.Label>*Cidade:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a cidade."
                name="city"
                className="form-control"
                onChange={onChange}
                value={values.city}
              />
            </Form.Group>

            <Form.Group controlId="neighborhood" className="neighborhood">
              <Form.Label>*Bairro:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o bairro."
                name="neighborhood"
                className="form-control"
                onChange={onChange}
                value={values.neighborhood}
              />
            </Form.Group>

            <Form.Group controlId="street" className="street">
              <Form.Label>*Rua/Avenida:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a Rua/Avenida."
                name="street"
                className="form-control"
                onChange={onChange}
                value={values.street}
              />
            </Form.Group>

            <Form.Group controlId="numberAddress" className="numberAddress">
              <Form.Label>*Número:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o número."
                name="numberAddress"
                className="form-control"
                onChange={onChange}
                value={values.numberAddress}
              />
            </Form.Group>

            <Form.Group controlId="address" className="address">
              <Form.Label>*Endereço:</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Aperte o botão de pesquisar para preeencher o endereço."
                  name="address"
                  className="form-control"
                  onChange={onChange}
                  value={values.address}
                  style={{ height: "38px" }}
                  disabled={true}
                />
                <IconButton
                  aria-label="Search database"
                  icon={<AiOutlineSearch />}
                  style={{ height: "38px" }}
                  onClick={handleSearchAddress}
                />
              </InputGroup>
            </Form.Group>

            <button
              className="primary-button-register"
              type="submit"
              onClick={handleRegisterBuilding}
            >
              cadastrar
              <BsBuildingFillAdd size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
