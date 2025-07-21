import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddOldClient = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    amountSpent: "",
    year: "",
    month: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { clientName, amountSpent, year, month } = formData;
      await axios.post("http://localhost:5000/api/old-clients", formData);
      setMessage(`✅ Client "${clientName}" added for ${month} ${year}.`);
      setFormData({ clientName: "", amountSpent: "", year: "", month: "" });
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-100 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Add Clients Data
                </h2>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="group bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              <svg
                className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm font-semibold">Dashboard</span>
            </button>
          </div>
          <p className="text-gray-600 text-lg mt-6">
            Enter the year, month and amount paid by the client correctly into
            this form.{" "}
          </p>
          <p className="text-gray-600 text-lg">
            Then view the submitted details through the clients tab.
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 px-6 py-4 rounded-2xl border-l-4 backdrop-blur-sm transition-all duration-500 transform ${
              message.startsWith("✅")
                ? "bg-green-50/80 border-green-500 text-green-800 shadow-green-100"
                : "bg-red-50/80 border-red-500 text-red-800 shadow-red-100"
            } shadow-lg`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.startsWith("✅") ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <span className="text-lg">
                  {message.startsWith("✅") ? "✅" : "❌"}
                </span>
              </div>
              <span className="font-medium">{message.substring(2)}</span>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Name */}
            <div className="group">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span>Client Name</span>
              </label>
              <input
                type="text"
                name="clientName"
                placeholder="Enter client name"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 text-gray-800 font-medium shadow-sm hover:shadow-md"
              />
            </div>

            {/* Amount Spent */}
            <div className="group">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <span>Amount Spent</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold text-lg">
                  $
                </span>
                <input
                  type="number"
                  name="amountSpent"
                  placeholder="0.00"
                  value={formData.amountSpent}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 text-gray-800 font-medium shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Year and Month Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Year */}
              <div className="group">
                <label className="block text-gray-700 font-semibold mb-3 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span>Year</span>
                </label>
                <input
                  type="number"
                  name="year"
                  placeholder="2023"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 text-gray-800 font-medium shadow-sm hover:shadow-md"
                />
              </div>

              {/* Month */}
              <div className="group">
                <label className="block text-gray-700 font-semibold mb-3 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span>Month</span>
                </label>
                <div className="relative">
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm appearance-none cursor-pointer text-gray-800 font-medium shadow-sm hover:shadow-md"
                  >
                    <option value="">Select month</option>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center space-x-3 shadow-lg mt-8"
            >
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="text-lg">Add Client</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex justify-center space-x-2 mt-2">
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOldClient;
