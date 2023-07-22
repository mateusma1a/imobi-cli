import React from "react";
import "../styles/styles.css";
import { CustomNav } from "../components/custom-nav/CustomNav";
import { Header } from "../components/Header";

export function Dashboard() {
  return (
    <>
      <Header />
      <div className="full-content">
        <CustomNav />

        <div className="main-content"></div>
      </div>
    </>
  );
}
