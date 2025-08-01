// src/pages/GoToDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function GoToDashboard() {
  const navigate = useNavigate();

  const handleGoDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-8 leading-tight">
          Marketing Management
          <span className="block text-blue-600 mt-2">Dashboard</span>
        </h1>
        
        <button
          onClick={handleGoDashboard}
          className="group inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
        >
          Access Dashboard
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}