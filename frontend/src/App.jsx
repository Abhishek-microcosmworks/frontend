// import React from "react";
// import Dashboard from "./components/Dashboard/Dashboard";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { LoginPage } from "./components/login";
// import { Register } from "./components/register";

// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/" element={<LoginPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

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
