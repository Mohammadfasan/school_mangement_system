// App.jsx (UPDATED for performance)

import React, { useState, lazy, Suspense } from 'react' // Import lazy and Suspense
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/Footer.jsx'
import Timetable from './pages/Timetable.jsx'
import Student from './pages/Student.jsx'
import Sport from './pages/Sport.jsx'
import Achievement from './pages/Achievement.jsx'
import Event from './pages/Event.jsx'
import LoginPopup from './components/Loginpop.jsx'
import SignupPopup from './components/SignupPopup.jsx'

// Admin imports - ***CHANGE TO LAZY LOADED IMPORTS***
const Layout = lazy(() => import('./pages/Admin/Layout.jsx'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard.jsx'));
const EventAdmin = lazy(() => import('./pages/Admin/Event.jsx'));
const Announcement = lazy(() => import('./pages/Admin/Annocement.jsx'));
const TimetableAdmin = lazy(() => import('./pages/Admin/Timetable.jsx'));
const SportAdmin = lazy(() => import('./pages/Admin/Sport.jsx'));
const AchievementAdmin = lazy(() => import('./pages/Admin/Achievement.jsx'));
const StudentAdmin = lazy(() => import('./pages/Admin/Student.jsx'));


const PublicLayout = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/dashboard');

  if (isAdminRoute) {
    return null; 
  }

  // Auth popup handlers
  const handleCloseLogin = () => setShowLogin(false);
  const handleCloseSignup = () => setShowSignup(false);
  
  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };
  
  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/student" element={<Student />} />
          <Route path="/sport" element={<Sport />} />
          <Route path="/achievement" element={<Achievement />} />
          <Route path="/event" element={<Event />} />
          <Route path="*" element={<div>Public Page Not Found</div>} />
        </Routes>
    
      <Footer />

      {/* Auth Popups */}
      <LoginPopup 
        isOpen={showLogin} 
        onClose={handleCloseLogin} 
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupPopup 
        isOpen={showSignup} 
        onClose={handleCloseSignup} 
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
}

const App = () => {
  return (
    <AuthProvider>
      
      <PublicLayout />
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        </div>
      }>
        <Routes>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="event_manage" element={<EventAdmin />} />
            <Route path="announcement_manage" element={<Announcement />} />
            <Route path="timetable_manage" element={<TimetableAdmin />} />
            <Route path="sport_manage" element={<SportAdmin />} />
            <Route path="achievement_manage" element={<AchievementAdmin />} />
            <Route path="student_manage" element={<StudentAdmin />} />
            <Route path="*" element={<div>Admin Page Not Found</div>} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App