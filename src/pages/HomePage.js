import React from "react";
import { logout } from "../auth";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold mb-4">🏠 Αρχική σελίδα</h1>
      <p className="mb-4">Καλώς ήρθες!</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600"
      >
        🚪 Αποσύνδεση
      </button>
    </div>
  );
};

export default HomePage;
