// App.jsx
import React from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import { Routes, Route } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Timetable from './pages/Timetable.jsx'
import Student from './pages/Student.jsx'
import Sport from './pages/Sport.jsx'
import Achievement from './pages/Achievement.jsx'
import Event from './pages/Event.jsx'

// Admin imports
import Layout from './pages/Admin/Layout.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import EventAdmin from './pages/Admin/Event.jsx'
import Announcement from './pages/Admin/Annocement.jsx'
import TimetableAdmin from './pages/Admin/Timetable.jsx'
import SportAdmin from './pages/Admin/Sport.jsx'
import AchievementAdmin from './pages/Admin/Achievement.jsx'
import StudentAdmin from './pages/Admin/Student.jsx'
import TeacherAdmin from './pages/Admin/Teacher.jsx'

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route path="/*" element={
          <>
            <div className="fixed top-0 left-0 w-full z-50 mt-1">
              <Navbar />
            </div>
            <div > {/* Add padding to account for fixed navbar */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/timetable" element={<Timetable />} />
                <Route path="/student" element={<Student />} />
                <Route path="/sport" element={<Sport />} />
                <Route path="/achievement" element={<Achievement />} />
                <Route path="/event" element={<Event />} />
               
                {/* Add more public routes here if needed */}
                <Route path="*" element={<div>Page Not Found</div>} />
              </Routes>
            </div>
            <Footer />
          </>
        } />
        
        {/* Admin Routes with Sidebar and Navbar_adi */}
        <Route path="/dashboard/*" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="event_manage" element={<EventAdmin />} />
          <Route path="announcement_manage" element={<Announcement />} />
          <Route path="timetable_manage" element={<TimetableAdmin />} />
          <Route path="sport_manage" element={<SportAdmin />} />
          <Route path="achievement_manage" element={<AchievementAdmin />} />
          <Route path="student_manage" element={<StudentAdmin />} />
          <Route path="teacher_manage" element={<TeacherAdmin />} />
          
          {/* Admin 404 page */}
          <Route path="*" element={<div>Admin Page Not Found</div>} />
        </Route>
      </Routes>
    </>
  )
}

export default App