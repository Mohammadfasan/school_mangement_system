// src/pages/Admin/DashboardComponents/StatCards.jsx

import React from 'react';
import StatCard from './StatCard'; // Import the individual StatCard
import { FiUsers, FiAward, FiCalendar, FiCheckCircle } from 'react-icons/fi';

const StatCards = React.memo(({ stats, loading }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard
      title="Total Students"
      value={stats.studentCount}
      icon={<FiUsers />}
      colorClass={{ bg: 'bg-blue-500', text: 'text-white', icon: 'text-blue-200' }}
      loading={loading}
      change={12}
    />
    <StatCard
      title="Sports Events"
      value={stats.sportCount}
      icon={<FiAward />}
      colorClass={{ bg: 'bg-green-500', text: 'text-white', icon: 'text-green-200' }}
      loading={loading}
      change={8}
    />
    <StatCard
      title="Total Events"
      value={stats.eventCount}
      icon={<FiCalendar />}
      colorClass={{ bg: 'bg-yellow-500', text: 'text-white', icon: 'text-yellow-200' }}
      loading={loading}
      change={5}
    />
    <StatCard
      title="Achievements"
      value={stats.achievementCount}
      icon={<FiCheckCircle />}
      colorClass={{ bg: 'bg-purple-500', text: 'text-white', icon: 'text-purple-200' }}
      loading={loading}
      change={15}
    />
  </div>
));

export default StatCards;