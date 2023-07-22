import React, { useContext } from "react";
import "../styles/styles.css";
import { Avatar } from "@chakra-ui/react";
import Dropdown from "react-bootstrap/Dropdown";
import { AuthContext } from "../store/Context";
import logoName from "../images/name.png";

export function Header() {
  const { logout } = useContext(AuthContext);
  const nickname = localStorage.getItem("nickname");
  const fullName = localStorage.getItem("fullName");
  let name = "";
  if (nickname != "" && nickname != null && nickname != undefined) {
    name = nickname;
  } else {
    name = fullName;
  }

  const handleLogout = async (e) => {
    logout();
  };

  return (
    <div className="header">
        <img
          src={logoName}
          id="logo-img-header"
          alt="Imobi logo"
        />
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic" className="header-dropdown">
          <label style={{ marginRight: "10px" }}>{name}</label>
          <Avatar name={name} size="sm" bgColor="blue.500" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleLogout}>Sair</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
