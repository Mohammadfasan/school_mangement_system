import React from 'react';
import AboutImage from '../assets/images/feature/about.png';

const About = () => {
  return (
    <div className='mb-10 md:mb-20'>
     
      <div className='text-center px-4 sm:px-6'>
        <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#059669] mb-4 md:mb-6 leading-tight'>
          About Us
        </h2>
        <p className='text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16 px-2'>
          Discover the unique features that set our school apart and make us the preferred choice for quality education.
        </p>
      </div>

      
      <div className='py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#059669]'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center'>
         
          <div className='order-2 md:order-1'> 
            <img 
              src={AboutImage} 
              alt="About Our System" 
              className='rounded-lg w-full h-auto shadow-lg md:shadow-xl'
            />
          </div>

         
          <div className='text-white order-1 md:order-2'>
            <h3 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight'>
              Our School Management System 🎓
            </h3>
            <p className='text-base sm:text-lg md:text-xl mb-4 md:mb-6 leading-relaxed'>
              is designed to make school operations <span className='font-semibold'>simple, smart, and efficient</span> 🚀. It connects administrators, teachers, students, and parents in one unified platform.
            </p>

            <h4 className='text-xl sm:text-2xl font-semibold mb-3 border-b-2 border-white/50 pb-2'>
              ✨ Key Highlights:
            </h4>
            <ul className='space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg list-disc pl-4 sm:pl-5 mb-4 md:mb-0'>
              <li>Easy student admission & record management.</li>
              <li>Online attendance & timetable tracking.</li>
              <li>Grade & exam result management.</li>
              <li>Communication tools for teachers, parents & students.</li>
              <li>Secure & user-friendly system.</li>
            </ul>

            <p className='mt-6 md:mt-8 text-sm sm:text-base md:text-lg leading-relaxed'>
              With this system, schools can <strong>save time</strong> ⏳, <strong>reduce paperwork</strong> 📄, and focus more on providing <strong>quality education</strong> 📚 to students.
            </p>
            
            {/* Stats Section */}
            <div className='mt-6 md:mt-8 flex justify-between sm:justify-center sm:gap-12 md:gap-20'>
              <div className='text-center'>
                <h1 className='text-xl sm:text-2xl md:text-3xl text-[#A7F8A4] font-bold'>Students</h1>
                <p className='text-base sm:text-lg md:text-lg text-white/80 mt-1'>9000+</p>
              </div>
              <div className='text-center'>
                <h1 className='text-xl sm:text-2xl md:text-3xl text-[#A7F8A4] font-bold'>Subject</h1>
                <p className='text-base sm:text-lg md:text-lg text-white/80 mt-1'>12+</p>
              </div>
              <div className='text-center'>
                <h1 className='text-xl sm:text-2xl md:text-3xl text-[#A7F8A4] font-bold'>Program</h1>
                <p className='text-base sm:text-lg md:text-lg text-white/80 mt-1'>120+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;