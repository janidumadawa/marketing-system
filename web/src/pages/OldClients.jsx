import React, { useState, useEffect } from "react";
import { Search, Filter, Users, TrendingUp, Target } from "lucide-react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import OldClientRow from "../components/OldClientRow";


const MONTHS = [
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

const OldClients = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(0);
  const [total, setTotal] = useState(0);
  const [oldTarget, setOldTarget] = useState(0);
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

  // Fetch clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/old-clients`,
        {
          params: { search, year, month },
        }
      );
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching old clients:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch target for selected period
  const fetchOldTarget = async () => {
    if (!year || !month) {
      setOldTarget(0);
      return;
    }
    try {
      const res = await axios.get(`${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/old-targets`, {
        params: { year, month },
      });
      setOldTarget(res.data.target || 0);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Error fetching old target:", error.message);
      }
      setOldTarget(0);
    }
  };

  // Fetch total for selected period
  const fetchTotal = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/old-clients/total`,
        {
          params: { year, month, search },
        }
      );
      setTotal(res.data.data?.total || 0);
    } catch (error) {
      console.error("Error fetching total:", error.message);
      setTotal(0);
    }
  };

  const fetchTotalClientCount = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/old-clients/count`,
        {
          params: { year, month, search }, // optional filters
        }
      );
      setTotalClientCount(res.data.count);
    } catch (err) {
      console.error("Error fetching total count:", err);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchTotal();
    fetchTotalClientCount();
  }, [search, year, month]);

  useEffect(() => {
    fetchOldTarget();
  }, [year, month]);

  // Filtered by search, year, and month (for table display)
  const filtered = clients.filter(
    (c) =>
      (!year || c.year === Number(year)) &&
      (!month || c.month === month) &&
      (!search || c.clientName.toLowerCase().includes(search.toLowerCase()))
  );

  // This function will be passed as onUpdate to each row
  const handleUpdateClient = (updatedClient) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client._id === updatedClient._id ? updatedClient : client
      )
    );
  };

  const fetchUniqueClientCount = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/old-clients/count-unique`,
        {
          params: { year, month, search },
        }
      );
      setClientCount(res.data.data.count);
    } catch (error) {
      console.error("Error fetching unique client count:", error.message);
      setClientCount(0);
    }
  };

  // Call on first load and whenever filters change
  useEffect(() => {
    fetchUniqueClientCount();
  }, [year, month, search]);

  useEffect(() => {
    if (oldTarget > 0) {
      const percent = (total / oldTarget) * 100;
      setPercentage(Math.round(percent));
    } else {
      setPercentage(0);
    }
  }, [total, oldTarget]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="lg:ml-72 min-h-screen">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Old Clients
              </h1>

              {/* Add Client button */}
              <div className="absolute top-2 right-10 flex flex-col gap-3 mt-40">
                <button
                  onClick={() => (window.location.href = "/add-client")}
                  className=" bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
                >
                  Add Monthly Clients
                </button>

                <button
                  onClick={() => (window.location.href = "/manage-targets")}
                  className=" bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
                >
                  Manage Targets
                </button>
              </div>

              <p className="text-gray-600">
                {" "}
                Sri Lankan financial year starts on every 1st of April and ends
                on 31st of March (365 days){" "}
              </p>
              <p>client data 2011 to 2025</p>

              <div className="mt-4 md:mt-0">
                <div className="bg-white bg-opacity-0 text-blue-900 px-2 py-4 text-left">
                  <p className="text-xs font-medium">Total Records</p>
                  <p className="text-lg font-semibold">{totalClientCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 w-full">
            <StatCard
              title="Target for Selected Period"
              value={`RS.${oldTarget.toLocaleString()}`}
              icon={Target}
              color="from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700"
            />

            <StatCard
              title="Total Sales"
              value={`Rs.${total.toLocaleString()}`}
              icon={TrendingUp}
              color="from-emerald-50 to-green-100 border-emerald-200 text-emerald-700"
            />

            <StatCard
              title="Target Achievement"
              value={`${percentage}%`}
              icon={TrendingUp}
              color="from-purple-50 to-purple-100 border-purple-200 text-purple-700"
            />

            <StatCard
              title="Clients"
              value={clientCount}
              icon={Users}
              color="from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700"
            />
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by client name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500 hover:bg-gray-100"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="text-gray-500" size={20} />
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-100"
                >
                  <option value="">All Years</option>
                  {[...Array(15)].map((_, i) => (
                    <option key={i} value={2011 + i}>
                      {2011 + i}
                    </option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:bg-gray-100"
                >
                  <option value="">All Months</option>
                  {MONTHS.map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-600 bg-blue-50 transition ease-in-out duration-150">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading Old Clients...
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No legacy clients found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or year/month filter
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Client Name
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Amount Spent
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Month
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((client, index) => (
                      <OldClientRow
                        key={client._id}
                        client={client}
                        className="hover:bg-gray-50 transition-colors duration-150"
                        onUpdate={handleUpdateClient}
                        onDelete={(id) =>
                          setClients((prev) => prev.filter((c) => c._id !== id))
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OldClients;
