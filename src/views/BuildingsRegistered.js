import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import { CustomNav } from "../components/custom-nav/CustomNav";
import { Header } from "../components/Header";
import {
  IconButton,
  useToast,
  Card,
  CardBody,
  CardFooter,
  Stack,
  Divider,
  ButtonGroup,
  Button,
  Image,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import Form from "react-bootstrap/Form";
import { InputGroup } from "react-bootstrap";
import { getAllBuildings } from "../shared/services/imobiApi";
import buildingImg from "../images/default-building.jpg";
import PDFDocument from "./BuildingsPdfDocument";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from 'file-saver';

/** Icons Imports */
import { AiOutlineSearch } from "react-icons/ai";
import { FaFilePdf } from "react-icons/fa";

export function BuildingsRegistered() {
  const toast = useToast();
  const [buildings, setBuildings] = useState([]);

  async function onInit() {
    const response = await getAllBuildings().catch((error) => {
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
      toast({
        title: "Você ainda não tem nenhum imóvel cadastrado.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });

      return;
    }

    setBuildings(response.data.result);
  }

  var generetePDF = async () => {
    if (buildings.length === 0) {
      toast({
        title: "Você ainda não tem nenhum imóvel cadastrado.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-center",
      });

      return;
    }

    const doc = <PDFDocument buildings={buildings} />;
    const asPdf = pdf(); // {} is important, throws without an argument
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    saveAs(blob, "document.pdf");
  };

  useEffect(() => {}, [buildings]);

  useEffect(() => {
    onInit();
  }, []);

  return (
    <>
      <Header />
      <div className="full-content">
        <CustomNav />

        <div className="main-content" style={{ height: "100%" }}>
          <Form.Group
            className="mb-3"
            controlId="buildingSearch"
            style={{ width: "100%" }}
          >
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Pesquise por um imóvel..."
                name="buildingSearch"
                className="form-control"
                list="resultsLocation"
                style={{ height: "38px" }}
              />
              <IconButton
                aria-label="Search database"
                icon={<AiOutlineSearch />}
                style={{ height: "38px" }}
              />
            </InputGroup>
          </Form.Group>

          <Flex flexWrap="wrap">
            {buildings.map((building) => (
              <Card
                className="building-card"
                key={building.id}
                style={{ marginRight: "5px", marginBottom: "5px" }}
              >
                <CardBody>
                  <Image
                    src={buildingImg}
                    alt="Building"
                    borderRadius="lg"
                    style={{ marginBottom: "5px" }}
                  />
                  <Stack>
                    <h6>
                      <strong>{building.address}</strong>
                    </h6>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing="2">
                    <Button variant="solid" colorScheme="blue">
                      Detalhes
                    </Button>
                    <Button variant="ghost" colorScheme="red">
                      Deletar
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            ))}
          </Flex>
        </div>
        <Tooltip
          label="Gere um PDF com a relação de imóveis."
          fontSize="md"
          placement="left"
        >
          <Button
            variant="solid"
            colorScheme="red"
            className="pdf-btn"
            onClick={generetePDF}
          >
            <FaFilePdf style={{ marginRight: "5px" }} />
            Gerar PDF
          </Button>
        </Tooltip>
      </div>
    </>
  );
}
