import React, { useState } from "react";
import "../../styles/styles.css";
import "./CustomNav.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Tooltip } from "@chakra-ui/react";

/** Icons Imports */
import { CiMenuBurger } from "react-icons/ci";
import { BsBuildingAdd, BsFillBuildingsFill } from "react-icons/bs";
import { FaMapMarkedAlt } from "react-icons/fa";

export function CustomNav() {
  const li = [
    ["Imóveis Cadastrados", "/buildings-registered"],
    ["Cadastrar Imóveis", "/building-register"],
    ["Imóveis no Mapa", "/buildings-location"],
  ];

  const [window, setWindow] = useState(true);
  const location = useLocation();

  let openClose = () => {
    if (window === false) {
      setWindow(true);
    } else {
      setWindow(false);
    }
  };

  return (
    <nav className="navbar-menu" style={{ width: window === false ? 285 : 75 }}>
      <button className="burger" onClick={() => openClose()}>
        <CiMenuBurger size={25} />
      </button>
      <ul className="navbar__list">
        {li.map((item, i) => (
          <Tooltip
            label={window === false ? "" : item[0]}
            fontSize="md"
            placement="right"
            key={i}
          >
            <Link to={item[1]}>
              <div
                className="navbar__li-box"
                style={{
                  borderLeft:
                    item[1] === location.pathname ? "7px solid #58b5fc" : "",
                }}
              >
                {item[0] == "Imóveis Cadastrados" && (
                  <BsFillBuildingsFill size={25} color="white" />
                )}

                {item[0] == "Cadastrar Imóveis" && (
                  <BsBuildingAdd size={25} color="white" />
                )}
                
                {item[0] == "Imóveis no Mapa" && (
                  <FaMapMarkedAlt size={25} color="white" />
                )}
                <li
                  className="navbar__li"
                  style={{
                    display: window === false ? "inline-block" : "none",
                  }}
                >
                  {item[0]}
                </li>
              </div>{" "}
            </Link>
          </Tooltip>
        ))}
      </ul>
    </nav>
  );
}
