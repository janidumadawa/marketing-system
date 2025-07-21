import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import SalesByYearChart from "../components/SalesByYearChart";
import { TrendingUp, Users, Filter } from "lucide-react";
import axios from "axios";
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    fetchTopClients();
    fetchSalesByYear();
  }, []);

  useEffect(() => {
    fetchTotalSales();
  }, [filterClient]);

  

  const fetchTopClients = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/api/old-clients/top-clients`
    );
    setTopClients(res.data);
  };

  const fetchSalesByYear = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/api/old-clients/sales-by-year`
    );
    setSalesByYear(
      res.data.map((item) => ({ year: item._id, total: item.total }))
    );
  };

  const fetchTotalSales = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/old-clients/total`, {
      params: { search: filterClient },
    });

    setTotalSales(res.data.data.total);
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
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
                  className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Back to Clients page
                </button>
              </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Filter className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            </div>
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search client by name..."
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <StatCard
                title="Total Sales"
                value={`Rs.${totalSales.toLocaleString()}`}
                icon={TrendingUp}
                color="from-blue-50 to-blue-100 border-blue-200 text-blue-700"
              />
            </div>
          </div>

          {/* Top 10 Clients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Top 10 Clients by Total Spend
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {topClients.map((client, index) => (
                <div
                  key={index}
                  className="relative p-6 bg-gradient-to-br from-white to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full">
                          {index + 1}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {client._id}
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        Rs.{client.totalSpent.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Total Spent</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-6 w-6 text-blue-600" />
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
                    tickFormatter={(value) =>
                      `Rs.${(value / 1000).toFixed(0)}K`
                    }
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

          {/* line graph call */}
          {/* <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Sales by Year
            </h2>
            <SalesByYearChart data={salesByYear} />
          </div> */}


        </main>
      </div>
    </div>
  );
}
