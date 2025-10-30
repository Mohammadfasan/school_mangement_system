// src/pages/Admin/DashboardUtils.js

import React from 'react';
import { FiUsers, FiAward, FiCalendar, FiActivity } from 'react-icons/fi';


export const processGenderData = (studentStats) => {
  if (studentStats.genderStats && Array.isArray(studentStats.genderStats)) {
    const maleCount = studentStats.genderStats.find(g => g._id === 'male' || g._id === 'Male')?.count || 0;
    const femaleCount = studentStats.genderStats.find(g => g._id === 'female' || g._id === 'Female')?.count || 0;
    const otherCount = studentStats.genderStats.find(g => g._id === 'other' || g._id === 'Other')?.count || 0;
    const total = studentStats.totalStudents || (maleCount + femaleCount + otherCount);
    
    return { male: maleCount, female: femaleCount, other: otherCount, total };
  }
  
  // Fallback logic
  const total = studentStats.totalStudents || studentStats.count || 0;
  return {
    male: Math.floor(total * 0.5),
    female: Math.floor(total * 0.5),
    other: total - Math.floor(total * 0.5) - Math.floor(total * 0.5),
    total
  };
};

export const generateRecentActivities = (sports, events, achievements, notifications) => {
  const activities = [];

  // Add recent sports events
  const recentSports = sports.slice(0, 2);
  recentSports.forEach(sport => {
    activities.push({
      icon: <FiActivity />,
      title: `Sports: ${sport.title}`,
      description: `${sport.type} event ${sport.status}`,
      time: "Recently",
      color: "green"
    });
  });

  // Add recent events
  const recentEvents = events.slice(0, 2);
  recentEvents.forEach(event => {
    activities.push({
      icon: <FiCalendar />,
      title: `Event: ${event.title}`,
      description: `Scheduled for ${new Date(event.date).toLocaleDateString()}`,
      time: "Upcoming",
      color: "blue"
    });
  });

  // Add recent achievements
  const recentAchievements = achievements.slice(0, 1);
  recentAchievements.forEach(achievement => {
    activities.push({
      icon: <FiAward />,
      title: `Achievement: ${achievement.title}`,
      description: `${achievement.student} won ${achievement.award}`,
      time: "Recent",
      color: "yellow"
    });
  });

  return activities.slice(0, 5);
};

export const generateMonthlyData = (students, events, sports) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    students: months.map(() => Math.floor(students * (0.8 + (Math.random() * 0.4)))),
    events: months.map(() => Math.floor(events * (0.7 + (Math.random() * 0.6)))),
    sports: months.map(() => Math.floor(sports * (0.6 + (Math.random() * 0.8))))
  };
};

export const getDemoData = () => ({
  studentCount: 150,
  sportCount: 23,
  eventCount: 8,
  achievementCount: 45,
  notificationCount: 12,
  genderData: {
    male: 80,
    female: 70,
    other: 0,
  },
  categoryStats: {
    sports: 23,
    events: 8,
    achievements: 45,
    notifications: 12
  },
  recentActivities: [
    {
      icon: <FiUsers />,
      title: "New student registration",
      description: "5 new students joined this week",
      time: "2 hours ago",
      color: "green"
    },
    {
      icon: <FiAward />,
      title: "Sports event completed",
      description: "Annual sports day concluded successfully",
      time: "1 day ago",
      color: "blue"
    },
    {
      icon: <FiCalendar />,
      title: "Upcoming event",
      description: "Science fair scheduled for next week",
      time: "2 days ago",
      color: "yellow"
    }
  ],
  monthlyData: generateMonthlyData(150, 8, 23)
});

export const hasGenderData = (genderData) => 
  genderData.male > 0 || genderData.female > 0 || genderData.other > 0;