import React from 'react'
import Hero from '../components/Hero'
import Feature from '../components/Feature'
import About from '../components/About'
import Facilities from '../components/Facilities'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'

const Home = () => {
  return (
    <div>
      <Hero />
      
      <Feature /> 
      <About />
      <Facilities />
      <Testimonials />
      <Contact />
    </div>
  )
}

export default Home
