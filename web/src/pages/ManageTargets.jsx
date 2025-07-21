import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Plus, Edit, Trash2 } from "lucide-react";

const ManageTargets = () => {
  const [targets, setTargets] = useState([]);
  const [yearFilter, setYearFilter] = useState(""); // start empty
  const [monthFilter, setMonthFilter] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchTargets = async () => {
    try {
      let query = [];
      if (yearFilter) query.push(`year=${yearFilter}`);
      if (monthFilter) query.push(`month=${monthFilter}`);
      const url = `http://localhost:5000/api/old-targets/all${
        query.length ? "?" + query.join("&") : ""
      }`;

      const res = await axios.get(url);
      setTargets(res.data);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (year, month) => {
    if (!window.confirm(`Delete target for ${month} ${year}?`)) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/old-targets?year=${year}&month=${month}`
      );
      setMessage(`✅ Deleted target for ${month} ${year}`);
      fetchTargets(); // Refresh list
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchTargets();
  }, [yearFilter, monthFilter]); // refetch when filters change

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="p-6">

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => navigate("/old-clients")}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Clients
          </button>
          <button
            onClick={() => navigate("/add-target")}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Target
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <Target className="text-yellow-600" size={32} />
                Manage Targets
              </h1>
              <p className="text-gray-600">
                Manage monthly sales targets for historical data
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Targets</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  placeholder="Any year"
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all hover:bg-gray-100"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all hover:bg-gray-100"
                >
                  <option value="">All months</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className="mb-6">
              <div
                className={`px-4 py-3 rounded-xl text-sm font-medium border-l-4 ${
                  message.startsWith("✅")
                    ? "bg-green-50 text-green-800 border-green-500"
                    : "bg-red-50 text-red-800 border-red-500"
                }`}
              >
                {message}
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {targets.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No targets found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or add a new target
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Target Amount
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {targets.map((t) => (
                      <tr key={t._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{t.year}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{t.month}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            Rs.{t.target.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors duration-200"
                              onClick={() =>
                                navigate("/add-target", {
                                  state: { edit: true, targetData: t },
                                })
                              }
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                            <button
                              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
                              onClick={() => handleDelete(t.year, t.month)}
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTargets;