import React, { createContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { api, createSession } from "../shared/services/imobiApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recoveredUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (recoveredUser && token) {
      setUser(recoveredUser);
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  const login = async (user, password) => {
    const response = await createSession(user, password);
    const loggedUser = response.data.userLogin;
    const nickname = response.data.nickname;
    const fullName = response.data.full_name;
    const token = response.data.token;

    api.defaults.headers.Authorization = `Bearer ${token}`;

    localStorage.setItem("userData", JSON.stringify(response.data));
    localStorage.setItem("user", loggedUser);
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("access_token", token);

    setUser(loggedUser);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    api.defaults.headers.Authorization = null;

    setUser(null);
    navigate("/login");
  };
  return (
    <AuthContext.Provider
      value={{ authenticated: !!user, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};