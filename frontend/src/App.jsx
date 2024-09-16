import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context";

function App() {
  return (
    <Router>
      <AuthProvider />
    </Router>
  );
}

export default App;
