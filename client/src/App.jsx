import React from "react";
import {  Route,Routes } from "react-router-dom";
import Login from "./pages/login/login";
import Chat from "./pages/Chat/Chat";
import Profileupdate from "./pages/Profileupdate.jsx/Profileupdate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profileupdate />} />
      </Routes>
    </>
  );
}

export default App;
