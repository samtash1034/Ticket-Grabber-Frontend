// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetail from "./pages/EventDetail";
import Purchase from "./pages/Purchase";
import UserCenter from "./pages/UserCenter";
import Order from "./pages/Order";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/purchase/:id" element={<Purchase />} />
        <Route path="/order/:orderId" element={<Order />} />

        <Route path="/user" element={<UserCenter />} />
      </Routes>
    </>
  );
}

export default App;
