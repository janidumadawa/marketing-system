import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600'
  };

  const iconColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    red: 'text-red-500',
    orange: 'text-orange-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-br ${colorClasses[color]} bg-opacity-10`}>
          <div className={`w-6 h-6 ${iconColors[color]}`}>
            {/* You can add different icons based on the stat type */}
            <TrendingUp size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Make sure you have this export
export default StatCard;