import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddAdvertisement() {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientId: "",
    file: null,
    date: "",
    message: "",
  });
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/old-clients`);
        setClients(res.data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "audio/mp3" || file.type === "audio/mpeg") {
        setFormData((prev) => ({ ...prev, file }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("clientId", formData.clientId);
    data.append("file", formData.file);
    if (formData.date) data.append("date", formData.date);
    if (formData.message) data.append("message", formData.message);

    try {
      await axios.post("/api/ads/upload", data);
      setMessage("✅ Advertisement uploaded successfully!");
      setFormData({ clientId: "", file: null, date: "", message: "" });
    } catch (err) {
      setMessage("❌ Upload failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/2 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-100 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Add Advertisement</h2>
                <p className="text-blue-600 text-sm font-medium">Upload audio advertisements for your clients</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="group bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-semibold">Dashboard</span>
            </button>
          </div>
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
            {/* Client Selection */}
            <div className="group">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span>Select Client</span>
              </label>
              <div className="relative">
                <select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm appearance-none cursor-pointer text-gray-800 font-medium shadow-sm hover:shadow-md"
                >
                  <option value="">-- Choose Client --</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.clientName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="group">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <span>Upload MP3 File</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-blue-200 hover:border-blue-300 bg-white/70"
                } backdrop-blur-sm shadow-sm hover:shadow-md`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="audio/mp3"
                  onChange={handleFileChange}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  {formData.file ? (
                    <div className="text-green-600 font-medium">
                      <p className="text-lg">✅ {formData.file.name}</p>
                      <p className="text-sm text-gray-500">File selected successfully</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 font-medium text-lg mb-2">Drop your MP3 file here</p>
                      <p className="text-blue-600 font-medium">or click to browse</p>
                      <p className="text-gray-500 text-sm mt-2">Supports MP3 audio files</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date and Message Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Date */}
              <div className="group">
                <label className="block text-gray-700 font-semibold mb-3 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>Date</span>
                  <span className="text-blue-500 text-sm font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-800 font-medium shadow-sm hover:shadow-md"
                />
              </div>
            </div>

              {/* Message */}
              <div className="group lg:col-span-1">
                <label className="block text-gray-700 font-semibold mb-3 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span>Message</span>
                  <span className="text-blue-500 text-sm font-normal">(optional)</span>
                </label>
              </div>

            {/* Full-width Message Textarea */}
            <div className="group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 text-gray-800 font-medium shadow-sm hover:shadow-md resize-none"
                placeholder="Enter optional message about this advertisement..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center space-x-3 shadow-lg mt-8"
            >
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span className="text-lg">Upload Advertisement</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-600/70 text-sm font-medium">
            Upload MP3 files for your advertisements.
          </p>
          <div className="flex justify-center items-center space-x-4 mt-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-blue-500 text-xs">Secure File Upload</span>
          </div>
        </div>
      </div>
    </div>
  );
}