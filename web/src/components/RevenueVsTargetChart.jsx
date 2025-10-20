import React, { useState, useEffect } from "react";
import { TrendingUp, Target, Filter, DollarSign, BarChart3 } from "lucide-react";
import { oldClientsAPI, oldTargetsAPI } from "../services/api";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
} from "recharts";

const RevenueVsTargetChart = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [chartType, setChartType] = useState("composed"); // "composed", "area", "bar"

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchCombinedData();
    }
  }, [selectedYear]);

  const fetchAvailableYears = async () => {
    try {
      const years = await oldTargetsAPI.getAvailableYears();
      setAvailableYears(years);
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
    } catch (error) {
      console.error("Error fetching available years:", error);
    }
  };

  const fetchCombinedData = async () => {
    try {
      setLoading(true);
      
      // Fetch both sales and targets data
      const [salesData, targetsData] = await Promise.all([
        oldClientsAPI.getSalesByYear(),
        oldTargetsAPI.getTargetsByYear()
      ]);

      // Process data for combined visualization
      const processedData = processCombinedData(salesData, targetsData);
      setCombinedData(processedData);

    } catch (error) {
      console.error("Error fetching combined data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processCombinedData = (salesData, targetsData) => {
    // Get all unique years from both datasets
    const salesYears = salesData.map(item => item._id);
    const targetYears = targetsData.map(item => item._id);
    const allYears = [...new Set([...salesYears, ...targetYears])].sort();

    return allYears.map(year => {
      const sales = salesData.find(item => item._id === year);
      const target = targetsData.find(item => item._id === year);
      
      const salesAmount = sales ? sales.total : 0;
      const targetAmount = target ? target.total : 0;
      const achievement = targetAmount > 0 ? (salesAmount / targetAmount) * 100 : 0;

      return {
        year: year.toString(),
        sales: salesAmount,
        target: targetAmount,
        achievement: Math.round(achievement),
        difference: salesAmount - targetAmount,
        status: achievement >= 100 ? 'exceeded' : achievement >= 80 ? 'near' : 'below'
      };
    });
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sales = payload.find(p => p.dataKey === 'sales')?.value || 0;
      const target = payload.find(p => p.dataKey === 'target')?.value || 0;
      const achievement = target > 0 ? (sales / target) * 100 : 0;
      const difference = sales - target;

      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 min-w-[200px]">
          <p className="font-bold text-gray-800 mb-3 text-center border-b pb-2">
            Year {label}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">Revenue:</span>
              </div>
              <span className="font-bold text-blue-600">
                Rs. {sales?.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">Target:</span>
              </div>
              <span className="font-bold text-yellow-600">
                Rs. {target?.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Difference:</span>
              <span className={`font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {difference >= 0 ? '+' : ''}Rs. {Math.abs(difference).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Achievement:</span>
              <span className={`font-bold ${
                achievement >= 100 ? 'text-green-600' : 
                achievement >= 80 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {achievement.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };



  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Revenue vs Targets Analysis</h2>
              <p className="text-sm text-gray-600">Yearly performance comparison</p>
            </div>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-600 bg-blue-50 transition ease-in-out duration-150">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading Performance Data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data: combinedData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart {...commonProps}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} />
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
                tickFormatter={(value) => `Rs.${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                name="Revenue"
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#salesGradient)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 3 }}
              />
              <Area
                name="Target"
                type="monotone"
                dataKey="target"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#targetGradient)"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#d97706', stroke: '#ffffff', strokeWidth: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} />
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
                tickFormatter={(value) => `Rs.${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                name="Revenue" 
                dataKey="sales" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar 
                name="Target" 
                dataKey="target" 
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]}
                barSize={30}
                opacity={0.7}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      default: // composed
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} />
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
                tickFormatter={(value) => `Rs.${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                name="Revenue" 
                dataKey="sales" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
              <Line 
                name="Target" 
                type="monotone" 
                dataKey="target" 
                stroke="#f59e0b" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#d97706', stroke: '#ffffff', strokeWidth: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 lg:mb-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Revenue vs Targets Analysis</h2>
            <p className="text-sm text-gray-600">Yearly performance comparison</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      {renderChart()}

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-blue-700 mb-1">Total Revenue</p>
          <p className="text-lg font-bold text-blue-900">
            Rs. {combinedData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <Target className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-yellow-700 mb-1">Total Targets</p>
          <p className="text-lg font-bold text-yellow-900">
            Rs. {combinedData.reduce((sum, item) => sum + item.target, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-green-700 mb-1">Avg Achievement</p>
          <p className="text-lg font-bold text-green-900">
            {Math.round(combinedData.reduce((sum, item) => sum + item.achievement, 0) / combinedData.length)}%
          </p>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <BarChart3 className="w-6 h-6 text-gray-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700 mb-1">Years Analyzed</p>
          <p className="text-lg font-bold text-gray-900">{combinedData.length}</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueVsTargetChart;