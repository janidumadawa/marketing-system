import React, { useState, useEffect } from "react";
import { Users, TrendingUp, Target, Plus, ArrowUpRight, Calendar } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import SalesByYearChart from "../components/SalesByYearChart";
import TargetsByYearChart from "../components/TargetsByYearChart";
import TargetsByMonthChart from "../components/TargetsByMonthChart";
import RevenueVsTargetChart from "../components/RevenueVsTargetChart";
import { oldClientsAPI, oldTargetsAPI } from "../services/api";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const [salesByYear, setSalesByYear] = useState([]);
  const [targetsByYear, setTargetsByYear] = useState([]);
  const [total, setTotal] = useState(0);
  const [uniqueClientCount, setUniqueClientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    fetchDashboardData();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [salesData, targetsData, totalSales, uniqueClients] = await Promise.all([
        oldClientsAPI.getSalesByYear(),
        oldTargetsAPI.getTargetsByYear(),
        oldClientsAPI.calculateTotal(),
        oldClientsAPI.countUniqueClients()
      ]);

      setSalesByYear(salesData);
      setTargetsByYear(targetsData);
      setTotal(totalSales.data?.total || 0);
      setUniqueClientCount(uniqueClients.data?.count || 0);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="lg:ml-72">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-[#023E8A] bg-clip-text text-transparent mb-2">
                  Welcome back, {user?.username}!
                </h1>
                <p className="text-gray-600 text-lg">
                  Here's what's happening with your marketing performance
                </p>
              </div>
              <div className="flex gap-3 mt-4 lg:mt-0">
                <button
                  onClick={() => (window.location.href = "/add-client")}
                  className="flex items-center gap-2 px-6 py-3 bg-[#023E8A] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Plus size={20} />
                  Add Client
                </button>
                <button
                  onClick={() => (window.location.href = "/manage-targets")}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 shadow-sm hover:shadow-md hover:border-[#023E8A] transition-all duration-200"
                >
                  <Target size={20} />
                  Manage Targets
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">Rs. {total.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">All Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueClientCount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Current Year</p>
                  <p className="text-2xl font-bold text-gray-900">{currentYear}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Calendar className="text-purple-600" size={24} />
                </div>
              </div>
            </div>

          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Revenue Analytics</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Sales by Year
                </div>
              </div>
              <SalesByYearChart data={salesByYear} />
            </div>

            {/* Targets Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Target Performance</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Targets by Year
                </div>
              </div>
              <TargetsByYearChart data={targetsByYear} />
            </div>
          </div>

          {/* Monthly Targets - Full Width */}
          {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Monthly Target Breakdown</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Monthly Progress
              </div>
            </div>
            <TargetsByMonthChart />
          </div> */}


          {/* Revenue vs Target Comparison Chart */}
          <div className="mt-8">
            <RevenueVsTargetChart />
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Need to manage your data?</h3>
                <p className="text-gray-600">Quick access to all management features</p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => (window.location.href = "/old-clients")}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                >
                  View All Clients
                </button>
                <button
                  onClick={() => (window.location.href = "/clients-analysis")}
                  className="px-4 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-[#023E8A]/80 transition-all duration-200"
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}