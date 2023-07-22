import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import { CustomNav } from "../components/custom-nav/CustomNav";
import { Header } from "../components/Header";
import mapBox from "mapbox-gl";
import { getAllBuildings } from "../shared/services/imobiApi";
import { useToast } from "@chakra-ui/react";

export function BuildingsLocation() {
  const toast = useToast();
  const [buildings, setBuildings] = useState([]);
  var marker = null;
  var currentMarkers = [];
  var mapboxgl = mapBox;
  mapboxgl.accessToken =
    process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ||
    "not found environment variable REACT_APP_MAPBOX_ACCESS_TOKEN";
  const [map, setMap] = useState(null);

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

    toast({
      title: "Clique nos marcadores para ver o endereço.",
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "bottom-center",
    });
  }

  useEffect(() => {
    if (currentMarkers.length > 0) {
      for (var i = currentMarkers.length - 1; i >= 0; i--) {
        currentMarkers[i].remove();
      }

      currentMarkers = [];
    }
    if (buildings != undefined) {
      if (buildings.length > 0) {
        buildings.forEach((build) => {
          marker = new mapboxgl.Marker()
            .setLngLat([build.longitude, build.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h6>${build.address}</h6>`))
            .addTo(map);
          currentMarkers.push(marker);
        });
      }
    }
  }, [buildings]);

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

    onInit();
  }, []);
  return (
    <>
      <Header />
      <div className="full-content">
        <CustomNav />
        <div className="main-content">
          <div
            id="map-box"
            className="buildings-location-map "
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>
    </>
  );
}
