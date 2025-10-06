import React from 'react'
import Hero from '../components/Hero'
import Feature from '../components/Feature'
import About from '../components/About'

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Feature /> 
      <About />
    </div>
  )
}

export default Home
