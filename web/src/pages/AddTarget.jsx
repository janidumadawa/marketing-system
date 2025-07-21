import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AddTarget = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    year: "",
    month: "",
    target: "",
  });

  useEffect(() => {
    if (location.state?.edit && location.state?.targetData) {
      const { year, month, target } = location.state.targetData;
      setFormData({ year, month, target });
    }
  }, [location.state]);

  const [message, setMessage] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/old-targets", formData);
      setMessage(`✅ Target ${res.data.target} added/updated for ${res.data.month} ${res.data.year}`);
      setFormData({ year: "", month: "", target: "" });
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-yellow-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📈 Add Monthly Target</h2>
          <button
            onClick={() => navigate("/manage-targets")}
            className="text-yellow-700 font-semibold text-sm hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Year Input */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              placeholder="e.g., 2025"
              className="w-full px-4 py-3 rounded-lg border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-white"
            />
          </div>

          {/* Month Select */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Month</label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-white"
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Target Amount</label>
            <input
              type="number"
              name="target"
              value={formData.target}
              onChange={handleChange}
              required
              placeholder="e.g., 100000"
              className="w-full px-4 py-3 rounded-lg border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Save Target
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTarget;
