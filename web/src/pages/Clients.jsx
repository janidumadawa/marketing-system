import React, { useState, useEffect } from "react";
import { User, PlusCircle, Search, Filter, UserPlus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ClientDetailsModal from "../components/ClientDetailsModal";
import AddClientForm from "../components/AddClientForm";
import axios from "axios";

const ClientPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/clients`);
        setClients(res.data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClientUpdate = (updatedClient) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client._id === updatedClient._id ? updatedClient : client
      )
    );
    setSelectedClient(null); // Close modal
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || client.isActive === (statusFilter === "active");

    return matchesSearch && matchesStatus;
  });

  const activeClients = clients.filter((c) => c.isActive);
  const inactiveClients = clients.filter((c) => !c.isActive);

  const stats = [
    {
      icon: User,
      title: "Total Clients",
      value: clients.length.toString(),
      change: "+8%",
      color: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700"
    },
    {
      icon: UserPlus,
      title: "Active Clients",
      value: activeClients.length.toString(),
      change: "+12%",
      color: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700"
    },
    {
      icon: User,
      title: "Inactive Clients",
      value: inactiveClients.length.toString(),
      change: "-3%",
      color: "from-red-50 to-red-100 border-red-200 text-red-700"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="lg:ml-72 min-h-screen">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                Client Management
              </h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              <PlusCircle className="w-5 h-5" />
              Add New Client
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
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
                  placeholder="Search clients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500 hover:bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clients Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading clients...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No clients found
                </h3>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr
                      key={client._id}
                      onClick={() => setSelectedClient(client)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {client.clientName}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {client.contact?.emails?.[0] || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {client.contact?.phones?.[0] || "-"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            client.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {client.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {client.address || "-"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onUpdate={handleClientUpdate}
          onDelete={(id) => {
            setClients((prev) => prev.filter((c) => c._id !== id));
            setSelectedClient(null);
          }}
        />
      )}

      {showAddForm && (
        <AddClientForm
          onClose={() => setShowAddForm(false)}
          onAdd={(newClient) => setClients((prev) => [...prev, newClient])}
        />
      )}
    </div>
  );
};

export default ClientPage;
