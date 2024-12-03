import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      {/* Notification Container */}
      <ToastContainer />

      {/* Application Routes */}
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login Page */}
        <Route path="/chat" element={<Chat />} /> {/* Chat Page */}
        <Route path="/profile" element={<ProfileUpdate />} /> {/* Profile Update Page */}
        <Route path="*" element={<div>404 Page Not Found</div>} /> {/* Fallback for undefined routes */}
      </Routes>
    </>
  );
}

export default App;
