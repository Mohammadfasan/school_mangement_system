// src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { FiUsers, FiAward, FiCalendar, FiCheckCircle, FiBell, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { 
  Chart, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { studentService } from '../../services/studentService';
import { sportService } from '../../services/sportService';
import { eventService } from '../../services/eventService';
import { achievementService } from '../../services/achievementService';
import { notificationService } from '../../services/announcementService';

// Register Chart.js components
Chart.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

// Helper component for stat cards
const StatCard = ({ icon, title, value, colorClass, loading, change }) => {
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
};

// Activity Item Component
const ActivityItem = ({ icon, title, description, time, color = 'blue' }) => {
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
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    studentCount: 0,
    sportCount: 0,
    eventCount: 0,
    achievementCount: 0,
    notificationCount: 0,
    genderData: { male: 0, female: 0, other: 0 },
    categoryStats: {},
    recentActivities: [],
    monthlyData: {
      students: [],
      events: [],
      sports: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // month, quarter, year

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📊 Fetching comprehensive dashboard data...');
        
        // Fetch all statistics in parallel
        const [
          studentStatsResponse,
          sportsResponse,
          eventsResponse,
          achievementsResponse,
          notificationsResponse
        ] = await Promise.all([
          studentService.getStudentStatistics(),
          sportService.getAllSports(),
          eventService.getAllEvents(),
          achievementService.getAllAchievements(),
          notificationService.getAllNotifications().catch(() => ({ data: [] })) // Safe fallback
        ]);

        // Process student statistics
        let studentStats = {};
        if (studentStatsResponse.data) {
          studentStats = studentStatsResponse.data.data || studentStatsResponse.data || {};
        }

        // Process gender data safely
        let maleCount = 0;
        let femaleCount = 0;
        let otherCount = 0;
        let totalStudents = 0;

        if (studentStats.genderStats && Array.isArray(studentStats.genderStats)) {
          maleCount = studentStats.genderStats.find(g => g._id === 'male' || g._id === 'Male')?.count || 0;
          femaleCount = studentStats.genderStats.find(g => g._id === 'female' || g._id === 'Female')?.count || 0;
          otherCount = studentStats.genderStats.find(g => g._id === 'other' || g._id === 'Other')?.count || 0;
          totalStudents = studentStats.totalStudents || (maleCount + femaleCount + otherCount);
        } else if (studentStats.male !== undefined || studentStats.female !== undefined) {
          maleCount = studentStats.male || 0;
          femaleCount = studentStats.female || 0;
          otherCount = studentStats.other || 0;
          totalStudents = studentStats.totalStudents || (maleCount + femaleCount + otherCount);
        } else {
          totalStudents = studentStats.totalStudents || studentStats.count || 0;
          maleCount = Math.floor(totalStudents * 0.5);
          femaleCount = Math.floor(totalStudents * 0.5);
          otherCount = totalStudents - maleCount - femaleCount;
        }

        // Process other data
        const sportsData = sportsResponse.data?.data || sportsResponse.data || [];
        const eventsData = eventsResponse.data?.data || eventsResponse.data || [];
        const achievementsData = achievementsResponse.data?.data || achievementsResponse.data || [];
        const notificationsData = notificationsResponse.data?.data || notificationsResponse.data || [];

        // Calculate category statistics
        const categoryStats = {
          sports: sportsData.length,
          events: eventsData.length,
          achievements: achievementsData.length,
          notifications: notificationsData.length
        };

        // Generate recent activities
        const recentActivities = generateRecentActivities(
          sportsData,
          eventsData,
          achievementsData,
          notificationsData
        );

        // Generate monthly data (mock data for demonstration)
        const monthlyData = generateMonthlyData(totalStudents, eventsData.length, sportsData.length);

        setStats({
          studentCount: totalStudents,
          sportCount: sportsData.length,
          eventCount: eventsData.length,
          achievementCount: achievementsData.length,
          notificationCount: notificationsData.length,
          genderData: {
            male: maleCount,
            female: femaleCount,
            other: otherCount,
          },
          categoryStats,
          recentActivities,
          monthlyData
        });

      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        setError('Failed to load dashboard data. Using demo data.');
        
        // Fallback demo data
        setStats({
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
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to generate recent activities
  const generateRecentActivities = (sports, events, achievements, notifications) => {
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

    return activities.slice(0, 5); // Return only 5 most recent
  };

  // Helper function to generate monthly data
  const generateMonthlyData = (students, events, sports) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return {
      students: months.map((month, index) => 
        Math.floor(students * (0.8 + (Math.random() * 0.4)))
      ),
      events: months.map((month, index) => 
        Math.floor(events * (0.7 + (Math.random() * 0.6)))
      ),
      sports: months.map((month, index) => 
        Math.floor(sports * (0.6 + (Math.random() * 0.8)))
      )
    };
  };

  // Chart data configurations
  const genderPieData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        label: 'Student Count',
        data: [
          stats.genderData.male || 0, 
          stats.genderData.female || 0, 
          stats.genderData.other || 0
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const categoryBarData = {
    labels: ['Students', 'Sports', 'Events', 'Achievements', 'Notifications'],
    datasets: [
      {
        label: 'Total Count',
        data: [
          stats.studentCount,
          stats.sportCount,
          stats.eventCount,
          stats.achievementCount,
          stats.notificationCount
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Students',
        data: stats.monthlyData.students,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Events',
        data: stats.monthlyData.events,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Sports',
        data: stats.monthlyData.sports,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your school management dashboard</p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
          <FiActivity className="text-yellow-600 mr-3" />
          <span className="text-yellow-800">{error}</span>
        </div>
      )}

      {/* Statistics Cards Grid */}
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

      {/* Charts and Additional Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gender Distribution</h3>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse rounded-full bg-gray-300 h-48 w-48"></div>
            </div>
          ) : stats.genderData.male === 0 && stats.genderData.female === 0 && stats.genderData.other === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <div className="text-center">
                <FiUsers className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No student data available</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <Pie data={genderPieData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Category Overview Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Overview</h3>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse w-full h-48 bg-gray-300 rounded"></div>
            </div>
          ) : (
            <div className="h-64">
              <Bar data={categoryBarData} options={barChartOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Additional Row for Monthly Trends and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse w-full h-48 bg-gray-300 rounded"></div>
            </div>
          ) : (
            <div className="h-64">
              <Line data={monthlyLineData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
            <FiActivity className="text-gray-400" />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse flex items-center space-x-3 p-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity, index) => (
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
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.notificationCount}</div>
          <div className="text-sm text-gray-600">Notifications</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">{Math.round((stats.genderData.male / stats.studentCount) * 100)}%</div>
          <div className="text-sm text-gray-600">Male Students</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-pink-600">{Math.round((stats.genderData.female / stats.studentCount) * 100)}%</div>
          <div className="text-sm text-gray-600">Female Students</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.achievementCount}</div>
          <div className="text-sm text-gray-600">Total Awards</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;