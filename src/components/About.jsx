import React from 'react';
import AboutImage from '../assets/images/feature/about.png';

const About = () => {
  return (
    <div className='mb-20'>
      {/* --- Heading Section --- */}
      <div className='text-center'>
        <h2 className='text-5xl font-extrabold text-[#059669] mb-6'>About Us</h2>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-16'>
          Discover the unique features that set our school apart and make us the preferred choice for quality education.
        </p>
      </div>

      {/* --- Content Section (Image & Text) --- */}
      <div className='py-16 px-4 sm:px-6 lg:px-8 bg-[#059669]'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          {/* Image Column */}
          <div className='order-2 md:order-1'> 
            <img src={AboutImage} alt="About Our System" className='rounded-lg' />
          </div>

          {/* Text/Description Column */}
          <div className='text-white order-1 md:order-2'>
            <h3 className='text-4xl font-bold mb-4'>
              Our School Management System 🎓
            </h3>
            <p className='text-xl mb-6 leading-relaxed'>
              is designed to make school operations <span className='font-semibold'>simple, smart, and efficient</span> 🚀. It connects administrators, teachers, students, and parents in one unified platform.
            </p>

            <h4 className='text-2xl font-semibold mb-3 border-b-2 border-white/50 pb-2'>
              ✨ Key Highlights:
            </h4>
            <ul className='space-y-3 text-lg list-disc pl-5'>
              <li>Easy student admission & record management.</li>
              <li>Online attendance & timetable tracking.</li>
              <li>Grade & exam result management.</li>
              <li>Communication tools for teachers, parents & students.</li>
              <li>Secure & user-friendly system.</li>
            </ul>

            <p className='mt-8 text-lg'>
              With this system, schools can **save time** ⏳, **reduce paperwork** 📄, and focus more on providing **quality education** 📚 to students.
            </p>
            <div className='mt-8 flex gap-20'>
              <div>
              <h1 className='text-3xl text-[#A7F8A4]'>Students</h1>
              <p className='text-lg text-white/80 text-center'>9000+</p>
              </div>
              <div>
              <h1 className='text-3xl text-[#A7F8A4]'>Subject</h1>
              <p className='text-lg text-white/80 text-center'>12+</p>
              </div>
              <div>
              <h1 className='text-3xl text-[#A7F8A4]'>Program</h1>
              <p className='text-lg text-white/80 text-center'>120+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;