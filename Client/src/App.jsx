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
      <Routes>
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="event_manage" element={<EventAdmin />} />
          <Route path="announcement_manage" element={<Announcement />} />
          {/* This route now correctly renders the imported component */}
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