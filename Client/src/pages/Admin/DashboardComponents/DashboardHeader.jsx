// src/pages/Admin/DashboardComponents/DashboardHeader.jsx

import React from 'react';

const DashboardHeader = React.memo(({ timeRange, onTimeRangeChange }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="text-gray-600 mt-1">Welcome to your school management dashboard</p>
    </div>
    <div className="flex items-center space-x-2">
      <select 
        value={timeRange}
        onChange={(e) => onTimeRangeChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="month">Last Month</option>
        <option value="quarter">Last Quarter</option>
        <option value="year">Last Year</option>
      </select>
    </div>
  </div>
));

export default DashboardHeader;