import React, { useState, useEffect } from "react";
import axios from "axios";

const OldClientRow = ({ client, className = "", onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState({ ...client });

  useEffect(() => {
    setEditedClient({ ...client });
  }, [client]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/old-clients/${client._id}`,
        editedClient
      );
      onUpdate(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(
          `${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/old-clients/${client._id}`
        );
        onDelete(client._id);
      } catch (err) {
        console.error("Error deleting client:", err);
      }
    }
  };

  // In your React component file (e.g., OldClients.js)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prev) => ({
      ...prev,
      [name]: name === "amountSpent" ? Number(value) : value,
    }));
  };

  return (
    <tr
      className={`hover:bg-gray-50 transition-all duration-200 group ${className}`}
    >
      {/* Client Name */}
      <td className="px-6 py-4">
        {isEditing ? (
          <input
            type="text"
            name="clientName"
            value={editedClient.clientName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {client.clientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-gray-900 font-medium group-hover:text-blue-700 transition-colors">
                {client.clientName}
              </div>
            </div>
          </div>
        )}
      </td>

      {/* Amount Spent */}
      <td className="px-6 py-4 text-right">
        {isEditing ? (
          <input
            type="number"
            name="amountSpent"
            value={editedClient.amountSpent}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        ) : (
          <>
            <div className="text-gray-900 font-semibold">
              Rs.{client.amountSpent?.toLocaleString()}
            </div>
          </>
        )}
      </td>

      {/* Year */}
      <td className="px-6 py-4 text-center">
        {isEditing ? (
          <input
            type="number"
            name="year"
            value={editedClient.year}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-50 to-violet-100 rounded-full border border-purple-200">
            <span className="text-purple-700 font-medium">{client.year}</span>
          </div>
        )}
      </td>

      {/* Month */}
      <td className="px-6 py-4 text-center">
        {isEditing ? (
          <select
            name="month"
            value={editedClient.month}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-50 to-green-100 rounded-full border border-emerald-200">
            <span className="text-emerald-700 font-medium">{client.month}</span>
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5 hover:from-green-600 hover:to-emerald-700 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Save
              </button>
              <button
                onClick={() => {
                  setEditedClient({ ...client });
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5 hover:from-gray-500 hover:to-gray-600 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5 hover:from-blue-600 hover:to-indigo-700 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5 hover:from-red-600 hover:to-pink-700 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OldClientRow;
