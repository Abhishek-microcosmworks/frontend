import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate, Routes, Route } from "react-router-dom";
import { LoginPage } from "../components/login";
import { Dashboard } from "../components/dashboard";
import { Register } from "../components/register";
import { Display } from "../components/display";

// Create an authentication context to share authentication state across components
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a token in localStorage and if it's still valid
    const token = localStorage.getItem("auth-token");
    const expiryTime = localStorage.getItem("tokenExp");
    const currentTime = Math.floor(new Date().getTime() / 1000);

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
    // Control the navigation depending on authentication status
    if (!isLoading) {
      if (isAuthenticated && location.pathname === "/") {
        navigate("/dashboard"); // If authenticated, redirect to dashboard
      } else if (!isAuthenticated && location.pathname === "/dashboard") {
        navigate("/"); // If not authenticated, redirect to login or display page
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading screen while checking auth status
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <div>
        <Routes>
          {/* The first/default route is DisplayPage */}
          <Route 
            path="/" 
            element={<Display />} // DisplayPage is the first page visible
          />

          {/* Handle authentication and redirection from DisplayPage */}
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
          />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
};

// Custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext);
