import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  UserRoundSearch 
} from "lucide-react";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", count: null },
    // { icon: Users, label: "Clients", path: "/clients", count: null },
    { icon: FileText, label: "Ads", path: "/ads", count: null },
    {
      icon: UserRoundSearch ,
      label: "Clients",
      path: "/old-clients",
      count: null,
    },
     {
    icon: TrendingUp, // you can pick another icon if you want
    label: "Clients Analysis",
    path: "/clients-analysis",
    count: null,
  },
  ];

  const handleNav = (item) => {
    navigate(item.path);
    if (isOpen) closeSidebar();
  };

  const isActive = (item) => location.pathname === item.path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`
        fixed left-0 top-0 h-full w-72
        bg-white
        border-r border-gray-200
        z-50
        shadow-xl
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header / Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <img
              src="./logo 2.png"
              alt="Logo"
              className="w-12 h-12 rounded-full"
            />

            <div className="flex flex-col">
              <span className="text-sm font-medium">Marketing Management</span>
              <span className="text-sm font-medium text-center"> System</span>
            </div>

            <div className="flex-1"></div>
          </div>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={closeSidebar}
          className="absolute -right-4 top-6 w-8 h-8 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center z-50 lg:hidden"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>

        {/* Navigation */}
        <nav className="p-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleNav(item)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
                    font-medium
                    ${
                      isActive(item)
                        ? "bg-blue-50 border border-blue-200 text-blue-700 shadow-sm"
                        : "hover:bg-gray-50 text-gray-700 border border-transparent hover:border-gray-200"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={22}
                      className={`${
                        isActive(item) ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
