import React, { useContext, useEffect } from "react";
import {  Route,Routes } from "react-router-dom";
import Login from "./pages/login/login";
import Chat from "./pages/Chat/Chat";
import Profileupdate from "./pages/Profileupdate.jsx/Profileupdate";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "./context/AppContext";

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
