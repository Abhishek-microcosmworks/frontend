import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate, Routes, Route } from "react-router-dom";
import {  LoginPage } from "../components/Login";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { Register } from "../components/Register";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const expiryTime = localStorage.getItem("tokenExp");
    const currentTime = Math.floor(new Date().getTime() / 1000);

    console.log("Auth check:", { token, expiryTime, currentTime });

    if (token && expiryTime && currentTime < expiryTime) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem("auth-token");
      localStorage.removeItem("tokenExp");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      console.log("Navigation check:", { isAuthenticated, pathname: location.pathname });
      if (isAuthenticated && (location.pathname === "/" || location.pathname === "/register")) {
        navigate("/dashboard");
      } else if (!isAuthenticated && location.pathname === "/dashboard") {
        navigate("/");
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  console.log("Render state:", { isLoading, isAuthenticated, pathname: location.pathname });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <div>
        <Routes>
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
          />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);