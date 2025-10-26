// src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { FiUsers, FiAward, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { studentService } from '../../services/studentService';
import { sportService } from '../../services/sportService';
import { eventService } from '../../services/eventService';

Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    studentCount: 0,
    sportCount: 0,
    eventCount: 0,
    genderData: { male: 0, female: 0, other: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel with error handling for each
      const [studentsRes, sportsRes, eventsRes] = await Promise.allSettled([
        studentService.getAllStudents(),
        sportService.getAllSports(),
        eventService.getAllEvents()
      ]);

      let students = [];
      let sports = [];
      let events = [];

      // Handle student data
      if (studentsRes.status === 'fulfilled') {
        const studentData = studentsRes.value.data;
        students = studentData.students || studentData || [];
      } else {
        console.error('Error fetching students:', studentsRes.reason);
      }

      // Handle sports data
      if (sportsRes.status === 'fulfilled') {
        const sportData = sportsRes.value.data;
        sports = sportData.data || sportData || [];
      } else {
        console.error('Error fetching sports:', sportsRes.reason);
      }

      // Handle events data
      if (eventsRes.status === 'fulfilled') {
        const eventData = eventsRes.value.data;
        events = eventData.data || eventData || [];
      } else {
        console.error('Error fetching events:', eventsRes.reason);
      }

      // Calculate gender distribution - handle different gender formats
      const maleCount = students.filter(s => 
        s.gender && s.gender.toLowerCase() === 'male'
      ).length;
      
      const femaleCount = students.filter(s => 
        s.gender && s.gender.toLowerCase() === 'female'
      ).length;
      
      const otherCount = students.filter(s => 
        s.gender && !['male', 'female'].includes(s.gender.toLowerCase())
      ).length;

      setStats({
        studentCount: students.length,
        sportCount: sports.length,
        eventCount: events.length,
        genderData: { 
          male: maleCount, 
          female: femaleCount, 
          other: otherCount 
        }
      });

    } catch (error) {
      console.error('Error in dashboard data processing:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const genderData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        label: 'Student Count',
        data: [stats.genderData.male, stats.genderData.female, stats.genderData.other],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(236, 72, 153, 0.8)', // Pink
          'rgba(139, 92, 246, 0.8)', // Purple
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Students Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">{stats.studentCount}</h2>
              <p className="text-blue-100 mt-1">Total Students</p>
            </div>
            <FiUsers className="text-3xl text-blue-200" />
          </div>
        </div>

        {/* Sports Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">{stats.sportCount}</h2>
              <p className="text-green-100 mt-1">Sports Activities</p>
            </div>
            <FiAward className="text-3xl text-green-200" />
          </div>
        </div>

        {/* Events Card */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">{stats.eventCount}</h2>
              <p className="text-yellow-100 mt-1">Total Events</p>
            </div>
            <FiCalendar className="text-3xl text-yellow-200" />
          </div>
        </div>

        {/* Gender Summary Card */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">
                {stats.genderData.male + stats.genderData.female + stats.genderData.other}
              </h2>
              <p className="text-purple-100 mt-1">Students by Gender</p>
            </div>
            <FiUsers className="text-3xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center">
                <FiCheckCircle className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Dashboard Loaded Successfully</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center">
                <FiUsers className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {stats.studentCount} Students Registered
                </p>
                <p className="text-xs text-gray-500">Total in system</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex-shrink-0 flex items-center justify-center">
                <FiCalendar className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {stats.eventCount} Events Scheduled
                </p>
                <p className="text-xs text-gray-500">Across all categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gender Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gender Distribution</h3>
          <div className="w-full h-64">
            <Pie data={genderData} options={chartOptions} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="text-blue-700 font-bold">{stats.genderData.male}</div>
              <div className="text-blue-600 text-sm">Male</div>
            </div>
            <div className="bg-pink-50 p-2 rounded-lg">
              <div className="text-pink-700 font-bold">{stats.genderData.female}</div>
              <div className="text-pink-600 text-sm">Female</div>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <div className="text-purple-700 font-bold">{stats.genderData.other}</div>
              <div className="text-purple-600 text-sm">Other</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.studentCount}</div>
            <div className="text-gray-600">Students</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.sportCount}</div>
            <div className="text-gray-600">Sports</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.eventCount}</div>
            <div className="text-gray-600">Events</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;