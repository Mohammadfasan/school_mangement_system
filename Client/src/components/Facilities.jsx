import React from 'react'
import Smart from '../assets/images/feature/smart.jpeg'
import Spport from '../assets/images/feature/support.png'
import Secure from '../assets/images/feature/secure.jpg'
import Library from '../assets/images/feature/library.png'
import performance from '../assets/images/feature/performance.png'
import smartclass from '../assets/images/feature/smartclass.png'

const Facilities = () => {
  return (
    <div className='py-12 px-4 sm:px-6 lg:px-8'>
      <div className='text-center px-4 sm:px-6 mb-12'>
        <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#059669] mb-4 md:mb-6 leading-tight'>
          Facilities
        </h2>
        <p className='text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16 px-2'>
          Discover the unique features that set our school apart and make us the preferred choice for quality education.
        </p>
      </div>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        {/* Library Facility */}
        <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#059669] hover:scale-105 group'>
          <div className='w-32 h-32 sm:w-36 sm:h-36 mb-6 rounded-full border-4 border-gray-200 group-hover:border-[#059669] group-hover:bg-green-50 transition-all duration-300 flex items-center justify-center p-4'>
            <img src={Library} alt="Library" className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300' />
          </div>
          <h3 className='text-2xl font-bold text-gray-800 group-hover:text-[#059669] transition-colors duration-300'>Digital Library</h3>
        </div>

        {/* Performance Facility */}
        <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#059669] hover:scale-105 group'>
          <div className='w-32 h-32 sm:w-36 sm:h-36 mb-6 rounded-full border-4 border-gray-200 group-hover:border-[#059669] group-hover:bg-green-50 transition-all duration-300 flex items-center justify-center p-4'>
            <img src={performance} alt="Performance" className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300' />
          </div>
          <h3 className='text-2xl font-bold text-gray-800 group-hover:text-[#059669] transition-colors duration-300'>Performance Center</h3>
        </div>

        {/* Smart Class Facility */}
        <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#059669] hover:scale-105 group'>
          <div className='w-32 h-32 sm:w-36 sm:h-36 mb-6 rounded-full border-4 border-gray-200 group-hover:border-[#059669] group-hover:bg-green-50 transition-all duration-300 flex items-center justify-center p-4'>
            <img src={smartclass} alt="Smart Class" className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300' />
          </div>
          <h3 className='text-2xl font-bold text-gray-800 group-hover:text-[#059669] transition-colors duration-300'>Smart Classrooms</h3>
        </div>

        {/* Smart Infrastructure */}
        <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#059669] hover:scale-105 group'>
          <div className='w-32 h-32 sm:w-36 sm:h-36 mb-6 rounded-full border-4 border-gray-200 group-hover:border-[#059669] group-hover:bg-green-50 transition-all duration-300 flex items-center justify-center p-4'>
            <img src={Smart} alt="Smart Infrastructure" className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300' />
          </div>
          <h3 className='text-2xl font-bold text-gray-800 group-hover:text-[#059669] transition-colors duration-300'>Smart Infrastructure</h3>
        </div>

        {/* Student Support */}
        <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#059669] hover:scale-105 group'>
          <div className='w-32 h-32 sm:w-36 sm:h-36 mb-6 rounded-full border-4 border-gray-200 group-hover:border-[#059669] group-hover:bg-green-50 transition-all duration-300 flex items-center justify-center p-4'>
            <img src={Spport} alt="Student Support" className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300' />
          </div>
          <h3 className='text-2xl font-bold text-gray-800 group-hover:text-[#059669] transition-colors duration-300'>Student Support</h3>
        </div>

        {/* Secure Campus */}
        <div className='flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#059669] hover:scale-105 group'>
          <div className='w-32 h-32 sm:w-36 sm:h-36 mb-6 rounded-full border-4 border-gray-200 group-hover:border-[#059669] group-hover:bg-green-50 transition-all duration-300 flex items-center justify-center p-4'>
            <img src={Secure} alt="Secure Campus" className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300' />
          </div>
          <h3 className='text-2xl font-bold text-gray-800 group-hover:text-[#059669] transition-colors duration-300'>Secure Campus</h3>
        </div>
      </div>
    </div>
  )
}

export default Facilities