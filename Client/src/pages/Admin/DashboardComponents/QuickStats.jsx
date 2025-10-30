// src/pages/Admin/DashboardComponents/QuickStats.jsx

import React from 'react';

const QuickStats = React.memo(({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
      <div className="text-2xl font-bold text-blue-600">{stats.notificationCount}</div>
      <div className="text-sm text-gray-600">Notifications</div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
      <div className="text-2xl font-bold text-green-600">
        {stats.studentCount > 0 ? Math.round((stats.genderData.male / stats.studentCount) * 100) : 0}%
      </div>
      <div className="text-sm text-gray-600">Male Students</div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
      <div className="text-2xl font-bold text-pink-600">
        {stats.studentCount > 0 ? Math.round((stats.genderData.female / stats.studentCount) * 100) : 0}%
      </div>
      <div className="text-sm text-gray-600">Female Students</div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
      <div className="text-2xl font-bold text-purple-600">{stats.achievementCount}</div>
      <div className="text-sm text-gray-600">Total Awards</div>
    </div>
  </div>
));

export default QuickStats;