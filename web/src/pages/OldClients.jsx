import React, { useState, useEffect } from "react";
import { Search, Filter, Users, TrendingUp, Target, Plus, Download, BarChart3 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import OldClientRow from "../components/OldClientRow";
import { oldClientsAPI, oldTargetsAPI } from "../services/api";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const OldClients = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [oldTarget, setOldTarget] = useState(0);
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [totalClientCount, setTotalClientCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [clientsData, totalData, countData, uniqueCountData, targetData] = await Promise.all([
        oldClientsAPI.getOldClients({ search, year, month }),
        oldClientsAPI.calculateTotal({ search, year, month }),
        oldClientsAPI.countAllClients({ search, year, month }),
        oldClientsAPI.countUniqueClients({ search, year, month }),
        year && month ? oldTargetsAPI.getOldTarget(year, month) : Promise.resolve({ target: 0 })
      ]);

      setClients(clientsData);
      setTotal(totalData.data?.total || 0);
      setTotalClientCount(countData.count || 0);
      setClientCount(uniqueCountData.data?.count || 0);
      setOldTarget(targetData.target || 0);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [search, year, month]);

  useEffect(() => {
    if (oldTarget > 0) {
      const percent = (total / oldTarget) * 100;
      setPercentage(Math.round(percent));
    } else {
      setPercentage(0);
    }
  }, [total, oldTarget]);

  const handleUpdateClient = (updatedClient) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client._id === updatedClient._id ? updatedClient : client
      )
    );
  };

  const filteredClients = clients.filter(
    (c) =>
      (!year || c.year === Number(year)) &&
      (!month || c.month === month) &&
      (!search || c.clientName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="lg:ml-72">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="p-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#E0F2FE] rounded-lg">
                  <Users className="text-[#004f77]" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-[#023E8A] bg-clip-text text-transparent">
                    Client Management
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Sri Lankan financial year: 1st April to 31st March • Data from 2011 to 2025
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-6 mt-4">
                <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{totalClientCount.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
                  <p className="text-sm font-medium text-gray-600">Active Filter</p>
                  <p className="text-lg font-semibold text-[#004f77]">
                    {year || "All Years"} • {month || "All Months"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-0 lg:ml-6">
              <button
                onClick={() => (window.location.href = "/add-client")}
                className="flex items-center gap-2 px-6 py-3 bg-[#004f77] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Plus size={20} />
                Add Client
              </button>
              <button
                onClick={() => (window.location.href = "/manage-targets")}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
              >
                <Target size={20} />
                Targets
              </button>
              <button
                onClick={() => (window.location.href = "/clients-analysis")}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200"
              >
                <BarChart3 size={20} />
                Analytics
              </button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-sm border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700 mb-1">Period Target</p>
                  <p className="text-2xl font-bold text-yellow-900">Rs. {oldTarget.toLocaleString()}</p>
                </div>
                <Target className="text-yellow-600" size={24} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Actual Sales</p>
                  <p className="text-2xl font-bold text-green-900">Rs. {total.toLocaleString()}</p>
                </div>
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 shadow-sm border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Achievement</p>
                  <p className="text-2xl font-bold text-purple-900">{percentage}%</p>
                  <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-sm border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Unique Clients</p>
                  <p className="text-2xl font-bold text-blue-900">{clientCount.toLocaleString()}</p>
                </div>
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 hover:shadow-md transition-all duration-200">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search clients by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500 hover:bg-gray-100"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Filter className="text-gray-500" size={20} />
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-100 min-w-[140px]"
                >
                  <option value="">All Years</option>
                  {[...Array(15)].map((_, i) => (
                    <option key={i} value={2011 + i}>{2011 + i}</option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-100 min-w-[160px]"
                >
                  <option value="">All Months</option>
                  {MONTHS.map((m, i) => (
                    <option key={i} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Clients Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-600 bg-blue-50 transition ease-in-out duration-150">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading Client Data...
                </div>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No clients found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or add new clients</p>
                <button
                  onClick={() => (window.location.href = "/add-client")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add New Client
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Client Details
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Investment
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredClients.map((client) => (
                      <OldClientRow
                        key={client._id}
                        client={client}
                        onUpdate={handleUpdateClient}
                        onDelete={(id) => setClients((prev) => prev.filter((c) => c._id !== id))}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary Footer */}
          {filteredClients.length > 0 && (
            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-blue-700">
                  Showing <strong>{filteredClients.length}</strong> of <strong>{totalClientCount}</strong> total records
                </div>
                {/* <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                    <Download size={16} />
                    Export Data
                  </button>
                </div> */}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OldClients;