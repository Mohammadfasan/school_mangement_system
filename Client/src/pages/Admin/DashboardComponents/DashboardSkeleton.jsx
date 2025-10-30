// src/pages/Admin/DashboardComponents/DashboardSkeleton.jsx

import React from 'react';

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-64"></div>
      </div>
      <div className="h-10 bg-gray-300 rounded w-32"></div>
    </div>

    {/* Statistics Cards Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-gray-300 rounded-xl p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-8 bg-gray-400 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-400 rounded w-24"></div>
            </div>
            <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Charts Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6">
          <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
            <div className="text-gray-500">Loading content...</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DashboardSkeleton;