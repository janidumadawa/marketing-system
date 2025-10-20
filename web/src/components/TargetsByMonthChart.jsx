import React, { useState, useEffect } from 'react';
import { oldTargetsAPI } from '../services/api';

const TargetsByMonthChart = () => {
  const [data, setData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchTargetsByMonth();
    }
  }, [selectedYear]);

  const fetchAvailableYears = async () => {
    try {
      const years = await oldTargetsAPI.getAvailableYears();
      setAvailableYears(years);
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[0]);
      }
    } catch (error) {
      console.error('Error fetching available years:', error);
    }
  };

  const fetchTargetsByMonth = async () => {
    try {
      setLoading(true);
      const targetsData = await oldTargetsAPI.getTargetsByMonth(selectedYear);
      setData(targetsData);
    } catch (error) {
      console.error('Error fetching targets by month:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading chart...</div>;
  }

  return (
    <div className="p-4">
      {/* Year selector */}
      <div className="mb-4">
        <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Simple bar chart representation */}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.month} className="flex items-center">
            <div className="w-20 text-sm text-gray-600">{item.shortMonth}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-blue-500 h-6 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((item.target / 50000) * 100, 100)}%`
                }}
              ></div>
            </div>
            <div className="w-16 text-right text-sm font-medium">
              ${item.target.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TargetsByMonthChart;