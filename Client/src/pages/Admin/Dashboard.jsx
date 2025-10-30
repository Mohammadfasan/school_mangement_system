
import React, { useState, lazy } from 'react';
import useDashboardData from './hooks/useDashboardData';
import { hasGenderData } from './DashboardUtils';


import DashboardSkeleton from './DashboardComponents/DashboardSkeleton';
import DashboardHeader from './DashboardComponents/DashboardHeader';
import ErrorAlert from './DashboardComponents/ErrorAlert';
import StatCards from './DashboardComponents/StatCards';
import ChartContainer from './DashboardComponents/ChartContainer';
import RecentActivities from './DashboardComponents/RecentActivities';
import QuickStats from './DashboardComponents/QuickStats';

const Pie = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Pie })));
const Bar = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Bar })));
const Line = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Line })));


const Dashboard = () => {
  // UI State: Simple range selection
  const [timeRange, setTimeRange] = useState('month');

  // Core Logic: Get data, loading, error, and chart data from the custom hook
  const { 
    stats, 
    loading, 
    error, 
    chartsLoaded, 
    chartData: { genderPieData, categoryBarData, monthlyLineData } 
  } = useDashboardData();

  // Chart options (kept here as they are simple configuration)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (context) => {
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
    scales: { y: { beginAtZero: true } }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader timeRange={timeRange} onTimeRangeChange={setTimeRange} />
      
      {error && <ErrorAlert message={error} />}
      
      <StatCards stats={stats} loading={loading} />
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer 
          title="Gender Distribution" 
          chartsLoaded={chartsLoaded}
          dataAvailable={hasGenderData(stats.genderData)}
        >
          <Pie data={genderPieData} options={chartOptions} />
        </ChartContainer>

        <ChartContainer 
          title="Category Overview" 
          chartsLoaded={chartsLoaded}
        >
          <Bar data={categoryBarData} options={barChartOptions} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer 
          title="Monthly Trends" 
          chartsLoaded={chartsLoaded}
        >
          <Line data={monthlyLineData} options={chartOptions} />
        </ChartContainer>

        <RecentActivities activities={stats.recentActivities} />
      </div>

      <QuickStats stats={stats} />
    </div>
  );
};

export default Dashboard;