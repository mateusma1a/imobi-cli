import React, { Suspense, useContext } from "react";
import {
  Navigate,
  Routes,
  BrowserRouter as Router,
  Route,
  useLocation 
} from "react-router-dom";
import { AuthContext, AuthProvider } from "../store/Context";
import SpinnerUtil from "../components/spinner-util/SpinnerUtil";

// Routes imports
import { Login } from "../views/Login";
import { Dashboard } from "../views/Dashboard";
import { Register } from "../views/Register";
import { RegisterCompany } from "../views/RegisterCompany";
import { RegisterUser } from "../views/RegisterUser";
import { BuildingRegister } from "../views/BuildingRegister";
import { BuildingsLocation } from "../views/BuildingsLocation";
import { BuildingsRegistered } from "../views/BuildingsRegistered";

export function ApplicationRoutes() {
  const Private = ({ children }) => {
    const { authenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
      return <SpinnerUtil />;
    }

    if (location.pathname === '/login' && !authenticated) {
      return;
    } else if (!authenticated) {
      return <Navigate to="/login" />;
    } else {
      return children;
    }
  };

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-company" element={<RegisterCompany />} />
            <Route path="/register-user" element={<RegisterUser />} />
            <Route path="*" element={<Navigate to="/" />} />

            <Route
              path="/"
              element={
                <Private>
                  <Dashboard />
                </Private>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Private>
                  <Dashboard />
                </Private>
              }
            />
            <Route
              path="/building-register"
              element={
                <Private>
                  <BuildingRegister />
                </Private>
              }
            />
            <Route
              path="/buildings-location"
              element={
                <Private>
                  <BuildingsLocation />
                </Private>
              }
            />
            <Route
              path="/buildings-registered"
              element={
                <Private>
                  <BuildingsRegistered />
                </Private>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </Suspense>
  );
}
