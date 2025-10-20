import React from 'react';
import { FiUsers, FiAward, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  // ✅ Get student count from localStorage
  const savedStudents = JSON.parse(localStorage.getItem('students')) || [];
  const studentCount = savedStudents.length;
  
  // ✅ Get sport count from localStorage
  const savedSports = JSON.parse(localStorage.getItem('sports')) || [];
  const sportCount = savedSports.length;
  
  // ✅ Get event count from localStorage  <-- ADDED
  const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
  const eventCount = savedEvents.length;


  // --- Gender distribution data (optional) ---
  const maleCount = savedStudents.filter(s => s.gender === 'Male').length;
  const femaleCount = savedStudents.filter(s => s.gender === 'Female').length;

  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Student Count',
        data: [maleCount, femaleCount],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(236, 72, 153, 0.8)', // Pink
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Students */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">{studentCount}</h2>
              <p className="text-blue-100 mt-1">Students</p>
            </div>
            <FiUsers className="text-3xl text-blue-200" />
          </div>
        </div>

        {/* Sports */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">{sportCount}</h2>
              <p className="text-green-100 mt-1">Sports</p>
            </div>
            <FiAward className="text-3xl text-green-200" />
          </div>
        </div>

        {/* Events */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              {/* MODIFIED: Replaced "20+" with dynamic eventCount */}
              <h2 className="text-4xl font-bold">{eventCount}</h2>
              <p className="text-yellow-100 mt-1">Upcoming Events</p>
            </div>
            <FiCalendar className="text-3xl text-yellow-200" />
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
                <p className="text-sm font-medium text-gray-800">New Achievement Added</p>
                <p className="text-xs text-gray-500">2 Minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center">
                <FiCalendar className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Basketball Match Scheduled</p>
                <p className="text-xs text-gray-500">2 Minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gender Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gender Distribution</h3>
          <div className="w-full max-w-xs mx-auto" style={{ height: '250px' }}>
            <Pie data={genderData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;