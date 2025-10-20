import React from 'react'
import hero from '../assets/images/sch.png'

const Hero = () => {
  return (
    <div 
      className="w-full h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl pt-10 md:pt-20 rounded-lg pl-4 md:pl-18 items-center p-4 md:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 leading-tight
    bg-gradient-to-r from-[#059669] to-[#000000] text-transparent bg-clip-text text-center md:text-left">
  EDUSYNC MANAGEMENT SYSTEM
</h1>

          <p className='text-base sm:text-lg md:text-xl text-gray-400 mb-6 text-center md:text-left'>
            Streamline your school operations with our comprehensive management solution
          </p>
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start'>
            <button className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors duration-300 text-sm sm:text-base'>
              Get Started
            </button>
            <button className='border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors duration-300 text-sm sm:text-base'>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero