import React from "react";
import { Search, Filter } from "lucide-react";

const FilterBar = ({ searchTerm, onSearchChange, statusFilter, onStatusChange }) => (
  <div className="
    bg-white
    p-6 rounded-2xl
    shadow-sm border border-gray-200
    mb-8
    hover:shadow-md transition-shadow duration-200
  ">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full pl-10 pr-4 py-3
            bg-gray-50 text-gray-900
            border border-gray-300
            rounded-xl
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            placeholder-gray-500
            transition-all duration-200
            hover:bg-gray-100
          "
        />
      </div>
      <div className="flex items-center gap-3">
        <Filter className="text-gray-500" size={20} />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="
            px-4 py-3
            bg-gray-50 text-gray-900
            border border-gray-300
            rounded-xl
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200
            hover:bg-gray-100
          "
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  </div>
);

export default FilterBar;