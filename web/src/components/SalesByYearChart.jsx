import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const SalesByYearChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#e5e7eb" 
          strokeOpacity={0.6}
        />
        <XAxis 
          dataKey="_id" 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{ 
            value: "Year", 
            position: "insideBottomRight", 
            offset: -5,
            style: { textAnchor: 'end', fill: '#6b7280' }
          }}
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
            'Total Sales'
          ]}
          labelFormatter={(label) => `Year ${label}`}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={3}
          fill="url(#salesGradient)"
          dot={{ 
            fill: '#3b82f6', 
            strokeWidth: 2, 
            stroke: '#ffffff',
            r: 5
          }}
          activeDot={{ 
            r: 7, 
            fill: '#2563eb',
            stroke: '#ffffff',
            strokeWidth: 3,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesByYearChart;