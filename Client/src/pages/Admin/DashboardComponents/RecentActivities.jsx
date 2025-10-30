// src/pages/Admin/DashboardComponents/RecentActivities.jsx

import React from 'react';
import { FiActivity } from 'react-icons/fi';

// Activity Item Component (Memoized internally for coherence)
const ActivityItem = React.memo(({ icon, title, description, time, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`w-10 h-10 ${colorClasses[color]} rounded-full flex-shrink-0 flex items-center justify-center`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
});


const RecentActivities = React.memo(({ activities }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
      <FiActivity className="text-gray-400" />
    </div>
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <ActivityItem
            key={index}
            icon={activity.icon}
            title={activity.title}
            description={activity.description}
            time={activity.time}
            color={activity.color}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FiActivity className="text-4xl mx-auto mb-2 text-gray-300" />
          <p>No recent activities</p>
        </div>
      )}
    </div>
  </div>
));

export default RecentActivities;