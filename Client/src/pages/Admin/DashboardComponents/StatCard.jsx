// src/pages/Admin/DashboardComponents/StatCard.jsx

import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const StatCard = React.memo(({ icon, title, value, colorClass, loading, change }) => {
  const bgColor = colorClass?.bg || 'bg-gray-100';
  const textColor = colorClass?.text || 'text-gray-800';
  const iconColor = colorClass?.icon || 'text-gray-500';

  return (
    <div className={`shadow-md rounded-xl p-6 flex items-center justify-between ${bgColor} ${textColor} transition-all duration-300 hover:shadow-lg`}>
      {loading ? (
        <div className="animate-pulse w-full">
          <div className="h-6 w-16 bg-gray-300 rounded-md"></div>
          <div className="h-4 w-24 bg-gray-300 rounded-md mt-2"></div>
        </div>
      ) : (
        <div className="flex-1">
          <h2 className="text-4xl font-bold">{value}</h2>
          <p className={`${textColor} opacity-90 mt-1`}>{title}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              <FiTrendingUp className={`mr-1 ${change < 0 ? 'transform rotate-180' : ''}`} />
              {change > 0 ? '+' : ''}{change}% from last month
            </div>
          )}
        </div>
      )}
      <div className="p-3 rounded-full bg-white bg-opacity-20">
        {React.cloneElement(icon, { className: `text-3xl ${iconColor} opacity-70` })}
      </div>
    </div>
  );
});

export default StatCard;