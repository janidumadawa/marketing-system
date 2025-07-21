import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Music,
  Calendar,
  Search,
  Upload,
  Play,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdsPage = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    // Fetch ads from backend API
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/ads`);
        setAds(res.data);
      } catch (err) {
        console.error("Error fetching ads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Filter ads by title or filename
  const filteredAds = ads.filter((ad) =>
    (ad.title || ad.filename || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="lg:ml-72 min-h-screen">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="p-6">
          {/* Header and Add Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                Advertisement Library
              </h1>
            </div>
            <button
              onClick={() => navigate("/add-advertisement")}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 px-4 rounded-lg shadow-sm transition duration-300"
            >
              ➕ Add Advertisement
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow duration-200">
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={24}
              />
              <input
                type="text"
                placeholder="Search advertisements by title or filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 text-lg bg-gray-50 text-gray-900 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500 hover:bg-white"
              />
            </div>
          </div>

          {/* Ads List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading advertisements...</p>
              </div>
            ) : filteredAds.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Music className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No advertisements found
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAds.map((ad) => (
                  <AdCard key={ad._id} ad={ad} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Single Ad Card with Audio Player
const AdCard = ({ ad }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200 group">
    <div className="flex items-start gap-4 mb-4">
      <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
        <Music className="text-blue-600 w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
          {ad.title || ad.filename}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Calendar size={14} />
          <span>{new Date(ad.uploadedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>

    {/* Audio Player */}
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <audio controls src={ad.url} className="w-full h-8" preload="metadata">
        Your browser does not support the audio element.
      </audio>
    </div>

    {/* Action Buttons */}
    <div className="mt-4 flex gap-2">
      <button className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-sm font-medium">
        <Play size={16} />
        Preview
      </button>
      <button className="flex-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all text-sm font-medium">
        Details
      </button>
    </div>
  </div>
);

export default AdsPage;
