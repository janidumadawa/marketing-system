import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";

const TargetsByMonthChart = () => {
  const [targetsByMonth, setTargetsByMonth] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('area'); // 'area' or 'bar'

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
      const res = await axios.get("http://localhost:5000/api/old-targets/available-years");
      setAvailableYears(res.data);
      if (res.data.length > 0) {
        setSelectedYear(res.data[0]); // Set the latest year as default
      }
    } catch (error) {
      console.error("Error fetching available years:", error);
    }
  };

  const fetchTargetsByMonth = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/old-targets/targets-by-month?year=${selectedYear}`
      );
      setTargetsByMonth(res.data);
    } catch (error) {
      console.error("Error fetching targets by month:", error);
      setTargetsByMonth([]);
    } finally {
      setLoading(false);
    }
  };

  const renderAreaChart = () => (
    <AreaChart 
      data={targetsByMonth} 
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <defs>
        <linearGradient id="monthlyTargetsGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke="#e5e7eb" 
        strokeOpacity={0.6}
      />
      <XAxis 
        dataKey="shortMonth" 
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
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '12px'
        }}
        labelStyle={{ color: '#374151', fontWeight: '600' }}
        formatter={(value, name) => [
          `Rs.${value.toLocaleString()}`, 
          'Target'
        ]}
        labelFormatter={(label) => `${label} ${selectedYear}`}
      />
      <Area
        type="monotone"
        dataKey="target"
        stroke="#f59e0b"
        strokeWidth={3}
        fill="url(#monthlyTargetsGradient)"
        dot={{ 
          fill: '#f59e0b', 
          strokeWidth: 2, 
          stroke: '#ffffff',
          r: 4
        }}
        activeDot={{ 
          r: 6, 
          fill: '#d97706',
          stroke: '#ffffff',
          strokeWidth: 3,
        }}
      />
    </AreaChart>
  );

  const renderBarChart = () => (
    <BarChart 
      data={targetsByMonth} 
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.4}/>
        </linearGradient>
      </defs>
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke="#e5e7eb" 
        strokeOpacity={0.6}
      />
      <XAxis 
        dataKey="shortMonth" 
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
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '12px'
        }}
        labelStyle={{ color: '#374151', fontWeight: '600' }}
        formatter={(value, name) => [
          `Rs.${value.toLocaleString()}`, 
          'Target'
        ]}
        labelFormatter={(label) => `${label} ${selectedYear}`}
      />
      <Bar 
        dataKey="target" 
        fill="url(#barGradient)"
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Monthly Targets - {selectedYear}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Chart Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === 'area' 
                  ? 'bg-white text-amber-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === 'bar' 
                  ? 'bg-white text-amber-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Bar
            </button>
          </div>

          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            disabled={loading}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? renderAreaChart() : renderBarChart()}
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary */}
      {targetsByMonth.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-600">Total Targets</p>
              <p className="text-lg font-semibold text-amber-600">
                Rs.{targetsByMonth.reduce((sum, item) => sum + item.target, 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Highest Month</p>
              <p className="text-lg font-semibold text-gray-800">
                {targetsByMonth.reduce((max, item) => 
                  item.target > max.target ? item : max, 
                  { target: 0, shortMonth: 'N/A' }
                ).shortMonth}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Average</p>
              <p className="text-lg font-semibold text-gray-800">
                Rs.{Math.round(targetsByMonth.reduce((sum, item) => sum + item.target, 0) / 12).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetsByMonthChart;