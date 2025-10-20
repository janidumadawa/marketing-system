import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { TrendingUp, Users, Filter } from "lucide-react";
import { oldClientsAPI } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ClientsAnalysis() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topClients, setTopClients] = useState([]);
  const [salesByYear, setSalesByYear] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [filterClient, setFilterClient] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchTotalSales();
  }, [filterClient]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [topClientsData, salesData] = await Promise.all([
        oldClientsAPI.getTopClients(),
        oldClientsAPI.getSalesByYear()
      ]);

      setTopClients(topClientsData);
      setSalesByYear(salesData.map((item) => ({ year: item._id, total: item.total })));
    } catch (err) {
      console.error("Error fetching analysis data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalSales = async () => {
    try {
      const totalData = await oldClientsAPI.calculateTotal({ search: filterClient });
      setTotalSales(totalData.data?.total || 0);
    } catch (err) {
      console.error("Error fetching total sales:", err);
      setTotalSales(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="lg:ml-72 min-h-screen">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="p-6 space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#004f77] mb-2">
                Clients Analysis
              </h1>
              <p className="text-gray-600">
                Overview of client and sales trends
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>Top {topClients.length} clients analyzed</span>
              </div>
            </div>
          </div>

          {/* navigate to old clients page */}
          <div className="absolute top-30 right-20 p-4">
            <button
              onClick={() => (window.location.href = "/old-clients")}
              className="mt-2 inline-flex items-center px-4 py-2 bg-[#004f77] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Clients page
            </button>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Filter className="h-5 w-5 text-[#004f77]" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            </div>
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search client by name..."
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004f77] focus:border-[#004f77] transition-colors duration-200 bg-white"
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900">Rs. {totalSales.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-[#E0F2FE] rounded-xl">
                <TrendingUp className="text-[#004f77]" size={24} />
              </div>
            </div>
          </div>

          {/* Top 10 Clients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-6 w-6 text-[#004f77]" />
              <h2 className="text-xl font-bold text-gray-900">
                Top 10 Clients by Total Spend
              </h2>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-600 bg-blue-50 transition ease-in-out duration-150">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading Top Clients...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {topClients.map((client, index) => (
                  <div
                    key={index}
                    className="relative p-6 bg-gradient-to-br from-white to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="flex items-center justify-center w-6 h-6 bg-[#004f77] text-white text-xs font-bold rounded-full">
                            {index + 1}
                          </span>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {client._id}
                          </h3>
                        </div>
                        <p className="text-2xl font-bold text-[#004f77]">
                          Rs.{client.totalSpent.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Total Spent</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-6 w-6 text-[#004f77]" />
              <h2 className="text-xl font-bold text-gray-900">
                Year-by-Year Sales Performance
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesByYear}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="year"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rs.${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value) => [
                      `Rs.${value.toLocaleString()}`,
                      "Sales",
                    ]}
                  />
                  <Bar
                    dataKey="total"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}