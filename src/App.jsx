import React from 'react'
import Navbar from './components/Navbar.jsx'  
import Home from './pages/Home.jsx'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <>
     <div className="fixed top-0 left-0 w-full z-50 mt-1">
      <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>

  )
}

export default App