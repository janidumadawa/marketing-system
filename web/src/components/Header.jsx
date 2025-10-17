import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, Menu, X } from "lucide-react";

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header
      className="
      bg-white/95 backdrop-blur-sm
      border-b border-gray-200
      p-4 flex justify-between items-center sticky top-0 z-40
      shadow-sm
    "
    >
      {/* Left: Menu & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          {sidebarOpen ? (
            <X size={22} className="text-gray-600" />
          ) : (
            <Menu size={22} className="text-gray-600" />
          )}
        </button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Welcome back, {user?.username}
          </p>
        </div>
      </div>

      {/* Right: Notifications, User, Logout */}
      <div className="flex items-center gap-4">


        <div className="flex items-center gap-3">
  
          {/* <button
            onClick={() => navigate("/auth")}
            className="
              bg-gradient-to-r from-blue-500 to-indigo-500
              text-white px-6 py-2 rounded-full
              hover:from-blue-600 hover:to-indigo-600
              transition-all duration-200 transform hover:scale-105
              shadow-sm hover:shadow-md
              font-medium
            "
          >
            Logout
          </button> */}

          <button
            onClick={() => navigate("/")}
            className="
              bg-gradient-to-r from-red-500 to-red-500
              text-white px-6 py-2 rounded-full
              hover:from-red-600 hover:to-red-600
              transition-all duration-200 transform hover:scale-105
              shadow-sm hover:shadow-md
              font-medium
            "
          >
            Log out
          </button>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
