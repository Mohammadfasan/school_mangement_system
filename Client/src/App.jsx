// App.jsx
import React, { useState } from 'react'
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

// Admin imports
import Layout from './pages/Admin/Layout.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import EventAdmin from './pages/Admin/Event.jsx'
import Announcement from './pages/Admin/Annocement.jsx'
import TimetableAdmin from './pages/Admin/Timetable.jsx'
import SportAdmin from './pages/Admin/Sport.jsx'
import AchievementAdmin from './pages/Admin/Achievement.jsx'
import StudentAdmin from './pages/Admin/Student.jsx'

// Public Layout component with Auth Popups
// This component now only handles the public layout structure (Navbar/Footer/Popups)
const PublicLayout = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  
  // This location check is now crucial to hide the public layout on admin routes
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/dashboard');

  const handleShowLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleShowSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleCloseSignup = () => {
    setShowSignup(false);
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setTimeout(() => setShowSignup(true), 150);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setTimeout(() => setShowLogin(true), 150);
  };

  // 🛑 KEY LOGIC: If it's an admin route, return a placeholder or null 
  // to ensure the public Navbar/Footer are not rendered.
  if (isAdminRoute) {
    return null; 
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 mt-1">
        <Navbar 
          onLoginClick={handleShowLogin} 
          onSignupClick={handleShowSignup} 
        />
      </div>
      <div className="pt-16">
        {/* Public Routes are now defined in the main App component */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/student" element={<Student />} />
          <Route path="/sport" element={<Sport />} />
          <Route path="/achievement" element={<Achievement />} />
          <Route path="/event" element={<Event />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
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

// 📌 Reworked App component to combine Public and Admin routes cleanly.
const App = () => {
  return (
    <AuthProvider>
      {/* We use a conditional component structure.
        PublicLayout now handles its own routes and visibility.
        AdminRoutes is now wrapped inside a master Routes block for clarity.
      */}
      <PublicLayout />

      {/* Admin Routes only render when the URL matches /dashboard/* */}
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
    </AuthProvider>
  )
}

export default App