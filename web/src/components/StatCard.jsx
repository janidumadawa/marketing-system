import React from 'react';

const StatCard = ({ icon: Icon, title, value, color, change }) => {
  return (
    <div className={`
      bg-gradient-to-br ${color}
      p-6 rounded-2xl
      shadow-sm border
      hover:shadow-md
      transition-all duration-200 transform hover:-translate-y-1
    `}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm opacity-80">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;