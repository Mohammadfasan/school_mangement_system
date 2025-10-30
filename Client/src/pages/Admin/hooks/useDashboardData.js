// src/pages/Admin/hooks/useDashboardData.js

import { useState, useEffect, useMemo } from 'react';
import { processGenderData, generateRecentActivities, generateMonthlyData, getDemoData } from '../DashboardUtils';

// Service imports (Update path if necessary based on your project structure)
import { studentService } from '../../../services/studentService';
import { sportService } from '../../../services/sportService';
import { eventService } from '../../../services/eventService';
import { achievementService } from '../../../services/achievementService';
import { notificationService } from '../../../services/announcementService';

const useDashboardData = () => {
  const [stats, setStats] = useState({
    studentCount: 0,
    sportCount: 0,
    eventCount: 0,
    achievementCount: 0,
    notificationCount: 0,
    genderData: { male: 0, female: 0, other: 0 },
    categoryStats: {},
    recentActivities: [],
    monthlyData: { students: [], events: [], sports: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartsLoaded, setChartsLoaded] = useState(false);

  // 1. PERFORMANCE FIX: Dynamic Chart Registration
  // This registers the large Chart.js components only once, reducing initial bundle size.
  useEffect(() => {
    import('chart.js').then(chartjs => {
      chartjs.Chart.register(
        chartjs.ArcElement, 
        chartjs.Tooltip, 
        chartjs.Legend, 
        chartjs.CategoryScale,
        chartjs.LinearScale,
        chartjs.BarElement,
        chartjs.PointElement,
        chartjs.LineElement,
        chartjs.Title
      );
      setChartsLoaded(true); 
    }).catch(e => {
      console.error("Failed to load Chart.js dependencies dynamically:", e);
      setChartsLoaded(true);
    });
  }, []); 

  // 2. PERFORMANCE FIX: Concurrent Data Fetching
  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use Promise.all for parallel fetching. Each .catch prevents a single failed API call 
        // from crashing the entire load, ensuring partial data display.
        const [
          studentStatsResponse,
          sportsResponse,
          eventsResponse,
          achievementsResponse,
          notificationsResponse
        ] = await Promise.all([
          studentService.getStudentStatistics().catch(e => { console.error("Student service failed:", e); return { data: { data: {} } }; }),
          sportService.getAllSports().catch(e => { console.error("Sport service failed:", e); return { data: { data: [] } }; }),
          eventService.getAllEvents().catch(e => { console.error("Event service failed:", e); return { data: { data: [] } }; }),
          achievementService.getAllAchievements().catch(e => { console.error("Achievement service failed:", e); return { data: { data: [] } }; }),
          notificationService.getAllNotifications().catch(e => { console.error("Notification service failed:", e); return { data: { data: [] } }; }),
        ]);

        if (!isMounted) return;

        // Process data
        const studentStats = studentStatsResponse.data?.data || studentStatsResponse.data || {};
        const genderData = processGenderData(studentStats);
        const totalStudents = genderData.total;
        
        const sportsData = sportsResponse.data?.data || sportsResponse.data || [];
        const eventsData = eventsResponse.data?.data || eventsResponse.data || [];
        const achievementsData = achievementsResponse.data?.data || achievementsResponse.data || [];
        const notificationsData = notificationsResponse.data?.data || notificationsResponse.data || [];

        if (!studentStatsResponse.data || !sportsResponse.data || !eventsResponse.data || !achievementsResponse.data) {
             setError('Some data could not be loaded completely. Displaying partial data.');
        }

        if (isMounted) {
          setStats({
            studentCount: totalStudents,
            sportCount: sportsData.length,
            eventCount: eventsData.length,
            achievementCount: achievementsData.length,
            notificationCount: notificationsData.length,
            genderData,
            categoryStats: {
              sports: sportsData.length,
              events: eventsData.length,
              achievements: achievementsData.length,
              notifications: notificationsData.length
            },
            recentActivities: generateRecentActivities(sportsData, eventsData, achievementsData, notificationsData),
            monthlyData: generateMonthlyData(totalStudents, eventsData.length, sportsData.length)
          });
        }

      } catch (error) {
        if (isMounted) {
          console.error("❌ Fatal error fetching dashboard data:", error);
          setError('Failed to load dashboard data. Using demo data.');
          setStats(getDemoData());
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Memoized Chart Data Logic
  const chartData = useMemo(() => {
    // --- START: Chart data structure generation ---
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
    // --- END: Chart data structure generation ---

    return { genderPieData, categoryBarData, monthlyLineData };
  }, [stats]);

  return {
    stats,
    loading,
    error,
    chartsLoaded,
    chartData
  };
};

export default useDashboardData;