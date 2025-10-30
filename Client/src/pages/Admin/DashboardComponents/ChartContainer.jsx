// src/pages/Admin/DashboardComponents/ChartContainer.jsx

import React, { Suspense } from 'react';
import { FiUsers } from 'react-icons/fi';

// Chart component wrapper with fallback
const ChartWrapper = ({ children }) => (
  <Suspense fallback={
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Loading chart...</p>
      </div>
    </div>
  }>
    {children}
  </Suspense>
);

const ChartContainer = React.memo(({ title, children, dataAvailable = true, chartsLoaded }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {!chartsLoaded ? (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading chart...</p>
        </div>
      </div>
    ) : !dataAvailable ? (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <div className="text-center">
          <FiUsers className="text-4xl mx-auto mb-2 text-gray-300" />
          <p>No data available</p>
        </div>
      </div>
    ) : (
      <div className="h-64">
        <ChartWrapper>
          {children}
        </ChartWrapper>
      </div>
    )}
  </div>
));

export default ChartContainer;