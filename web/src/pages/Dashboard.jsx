import React, { useState, useEffect } from "react";
import { Users, Send, Headphones, TrendingUp, Target } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import SalesByYearChart from "../components/SalesByYearChart";
import TargetsByYearChart from "../components/TargetsByYearChart";
import TargetsByMonthChart from "../components/TargetsByMonthChart"; // Add this import
import axios from "axios";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const [salesByYear, setSalesByYear] = useState([]);
  const [targetsByYear, setTargetsByYear] = useState([]);

  const [oldTarget, setOldTarget] = useState(0);
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [clientCount, setClientCount] = useState(0);

  const [uniqueClientCount, setUniqueClientCount] = useState(0);

  useEffect(() => {
    if (oldTarget > 0) {
      const percent = (total / oldTarget) * 100;
      setPercentage(Math.round(percent));
    } else {
      setPercentage(0);
    }
  }, [total, oldTarget]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const fetchSalesByYear = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/old-clients/sales-by-year"
        );
        setSalesByYear(res.data);
      } catch (error) {
        console.error("Error fetching sales by year:", error);
      }
    };

    const fetchTargetsByYear = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/old-targets/targets-by-year"
        );
        setTargetsByYear(res.data);
      } catch (error) {
        console.error("Error fetching targets by year:", error);
      }
    };

    fetchSalesByYear();
    fetchTargetsByYear();
    fetchTotalClients();
    fetchTotalSales();
    fetchUniqueClientCount();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const fetchTotalClients = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/old-clients/count"
      );
      setClientCount(res.data.count || 0);
    } catch (err) {
      console.error("Error fetching client count:", err.message);
    }
  };

  const fetchTotalSales = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/old-clients/total"
      );
      setTotal(res.data.data.total || 0);
    } catch (err) {
      console.error("Error fetching total sales:", err.message);
    }
  };

  const fetchOldTarget = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/old-targets/latest"
      );
      setOldTarget(res.data.target || 0);
    } catch (err) {
      console.error("Error fetching old target:", err.message);
    }
  };

  const fetchUniqueClientCount = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/old-clients/count-unique"
      );
      setUniqueClientCount(res.data.data.count || 0);
    } catch (error) {
      console.error("Error fetching unique client count:", error.message);
      setUniqueClientCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="lg:ml-72 min-h-screen">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="p-6">
          {/* Add Client button */}
          <div className="flex justify-center items-center my-10">
            <button
              onClick={() => (window.location.href = "/add-client")}
              className="text-xl px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Add Monthly Clients
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-8 w-full mt-8">
            <StatCard
              title="Total Sales"
              value={`Rs.${total.toLocaleString()}`}
              icon={TrendingUp}
              color="from-emerald-50 to-green-100 border-emerald-200 text-emerald-700"
            />

            <StatCard
              title="Total Clients"
              value={uniqueClientCount}
              icon={Users}
              color="from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700"
            />
          </div>

          {/* Yearly Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-8">
            {/* Sales Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Sales by Year
              </h2>
              <SalesByYearChart data={salesByYear} />
            </div>

            {/* Targets Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Targets by Year
              </h2>
              <TargetsByYearChart data={targetsByYear} />
            </div>
          </div>

          {/* Monthly Targets Chart - Full Width */}
          <div className="mt-8">
            <TargetsByMonthChart />
          </div>
        </main>
      </div>
    </div>
  );
}