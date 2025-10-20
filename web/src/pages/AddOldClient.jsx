import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { oldClientsAPI } from "../services/api";

const AddOldClient = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    amountSpent: "",
    year: "",
    month: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const { clientName, amountSpent, year, month } = formData;
      
      // Convert amountSpent to number
      const clientData = {
        ...formData,
        amountSpent: Number(amountSpent),
        year: Number(year)
      };
      
      await oldClientsAPI.addOldClient(clientData);
      setMessage(`✅ Client "${clientName}" added for ${month} ${year}.`);
      setFormData({ clientName: "", amountSpent: "", year: "", month: "" });
    } catch (err) {
      console.error("Error adding client:", err);
      setMessage("❌ Error: " + (err.message || "Failed to add client"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      <div className="relative max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-100 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-3xl font-bold text-[#023E8A]">Add Clients Data</h2>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="group bg-blue-50 hover:bg-blue-100 text-[#023E8A] px-5 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-semibold">Dashboard</span>
            </button>
          </div>
          <p className="text-gray-600 text-lg mt-6">
            Enter the year, month and amount paid by the client correctly into this form.{" "}
          </p>
          <p className="text-gray-600 text-lg">
            Then view the submitted details through the clients tab.
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 px-6 py-4 rounded-2xl border-l-4 backdrop-blur-sm transition-all duration-500 transform ${
            message.startsWith("✅") 
              ? "bg-green-50/80 border-green-500 text-green-800 shadow-green-100" 
              : "bg-red-50/80 border-red-500 text-red-800 shadow-red-100"
          } shadow-lg`}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.startsWith("✅") ? "bg-green-100" : "bg-red-100"
              }`}>
                <span className="text-lg">{message.startsWith("✅") ? "✅" : "❌"}</span>
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
                <span>Client Name</span>
              </label>
              <input
                type="text"
                name="clientName"
                placeholder="Enter client name"
                value={formData.clientName}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 text-gray-800 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Amount Spent */}
            <div className="group">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center space-x-2">
                <span>Amount Spent</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold text-lg">Rs.</span>
                <input
                  type="number"
                  name="amountSpent"
                  placeholder="0.00"
                  value={formData.amountSpent}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 text-gray-800 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Year and Month Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Year */}
              <div className="group">
                <label className="block text-gray-700 font-semibold mb-3 flex items-center space-x-2">
                  <span>Year</span>
                </label>
                <input
                  type="number"
                  name="year"
                  placeholder="2023"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 text-gray-800 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Month */}
              <div className="group">
                <label className="block text-gray-700 font-semibold mb-3 flex items-center space-x-2">
                  <span>Month</span>
                </label>
                <div className="relative">
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm appearance-none cursor-pointer text-gray-800 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select month</option>
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#023E8A] hover:bg-[#023E8A]/80 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center space-x-3 shadow-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="text-lg">Adding Client...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">Add Client</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOldClient;