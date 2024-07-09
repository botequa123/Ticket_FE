// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import UserManagement from "./components/UserManagement";
import TicketManagement from './components/TicketManagement';

function App() {
  return (
    <Router>
      <div className="wrapper">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/usermanagement" element={<UserManagement />} />
          <Route path="/ticketManagement" element={<TicketManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
