import React from 'react'
import Navbar from './components/Navbar.jsx'  
import Home from './pages/Home.jsx'
import { Routes, Route } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Timetable from './pages/Timetable.jsx'
import Student from './pages/Student.jsx'
import Sport from './pages/Sport.jsx'

const App = () => {
  return (
    <>
     <div className="fixed top-0 left-0 w-full z-50 mt-1">
      <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/student" element={<Student />} />
        <Route path="/sport" element={<Sport />} />
    
      </Routes>
      <Footer />
    </>

  )
}

export default App