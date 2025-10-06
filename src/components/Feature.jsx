import React from 'react';
import Community from '../assets/images/feature/community.png';
import Education from '../assets/images/feature/Edu.png';
import Holistic from '../assets/images/feature/holstic.png';
import Heart from '../assets/images/feature/moden.png';
import Modern from '../assets/images/modern.jpeg';

const featuresData = [
  {
    icon: Community,
    title: 'Vibrant Community',
    description: 'Foster connections in a supportive and inclusive environment where every student belongs and thrives.',
    alt: 'Community Icon',
  },
  {
    icon: Education,
    title: 'Quality Education',
    description: 'A robust curriculum designed to challenge and inspire, delivered by passionate and experienced educators.',
    alt: 'Education Icon',
  },
  {
    icon: Holistic,
    title: 'Holistic Development',
    description: 'We focus on the intellectual, emotional, social, and physical well-being of every student.',
    alt: 'Holistic Icon',
  },
  {
    icon: Heart,
    title: 'Modern Facilities',
    description: 'State-of-the-art classrooms, labs, and resources to support 21st-century learning.',
    alt: 'Modern Icon',
  },
  {
    icon: Modern,
    title: 'Caring Environment',
    description: 'A culture of empathy and respect, promoting positive values and personal growth.',
    alt: 'Caring Icon',
  },
];

const Feature = () => {
  return (
    <div className='mt-10 items-center justify-center py-16 px-4 sm:px-6 lg:px-8'> 
      <div className='max-w-7xl mx-auto'>
       
        <div className='text-center mb-20'>
          <h2 className='text-5xl font-extrabold text-[#059669] mb-6'>Why This School is the Best?</h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Discover the unique features that set our school apart and make us the preferred choice for quality education.
          </p>
        </div>
        
        {/* Features Grid with Card Style, Border and Hover Effects */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8'>
          {featuresData.map((feature, index) => (
            <div 
              key={index} 
              className='
                relative
                flex flex-col items-center text-center p-8
                bg-white
                rounded-2xl
                border-2 border-gray-200
                shadow-lg
                transition-all duration-500 ease-in-out
                hover:border-[#059669]
                hover:shadow-2xl
                hover:scale-105
                hover:bg-gradient-to-br from-white to-green-50
                group
                cursor-pointer
                overflow-hidden
              '
            >
              {/* Animated Background Effect */}
              <div className='
                absolute inset-0 
                bg-gradient-to-br from-[#059669] to-[#10b981]
                opacity-0 group-hover:opacity-5
                transition-opacity duration-500
              '></div>

              {/* Top Accent Border */}
              <div className='
                absolute top-0 left-0 right-0 h-1
                bg-gradient-to-r from-transparent via-gray-300 to-transparent
                group-hover:from-[#059669] group-hover:via-[#10b981] group-hover:to-[#059669]
                transition-all duration-500
              '></div>

              {/* Icon Container */}
              <div className='
                relative
                w-20 h-20 rounded-full 
                border-2 border-gray-300
                bg-white
                flex items-center justify-center mb-6
                transition-all duration-500 ease-in-out
                group-hover:border-[#059669]
                group-hover:bg-green-50
                group-hover:scale-110
                group-hover:shadow-md
                z-10
              '>
                <img 
                  src={feature.icon} 
                  alt={feature.alt} 
                  className='
                    w-10 h-10 object-contain
                    transition-all duration-500
                    group-hover:scale-110
                    group-hover:filter group-hover:brightness-110
                  ' 
                />
                
                {/* Icon Hover Effect */}
                <div className='
                  absolute inset-0 rounded-full
                  bg-[#059669] opacity-0
                  group-hover:opacity-10
                  transition-opacity duration-300
                '></div>
              </div>
              
              {/* Title Section */}
              <div className='mb-4 relative z-10'>
                <h3 className='
                  text-xl font-bold text-gray-800 mb-4
                  transition-all duration-300
                  group-hover:text-[#059669]
                  group-hover:scale-105
                '>
                  {feature.title}
                </h3>
                
               
                <div className='
                  relative
                  w-16 h-1 bg-gray-300 mx-auto rounded-full
                  transition-all duration-500
                  group-hover:bg-gradient-to-r group-hover:from-[#059669] group-hover:to-[#10b981]
                  group-hover:w-20
                  group-hover:scale-110
                  overflow-hidden
                '>
                  <div className='
                    absolute inset-0
                    bg-gradient-to-r from-[#059669] to-[#10b981]
                    translate-x-[-100%] group-hover:translate-x-0
                    transition-transform duration-500
                  '></div>
                </div>
              </div>
              
             
              <p className='
                text-gray-600 text-base leading-relaxed
                transition-all duration-300
                group-hover:text-gray-700
                group-hover:font-medium
                relative z-10
              '>
                {feature.description}
              </p>

             
              <div className='
                absolute top-4 right-4
                w-2 h-2 rounded-full bg-gray-400
                transition-all duration-300
                group-hover:bg-[#059669]
                group-hover:scale-150
                group-hover:shadow-sm
              '></div>

              
              <div className='
                absolute top-3 left-3 w-3 h-3
                border-t-2 border-l-2 border-gray-300
                opacity-0 group-hover:opacity-100
                transition-all duration-500
                group-hover:border-[#059669]
              '></div>
              <div className='
                absolute top-3 right-3 w-3 h-3
                border-t-2 border-r-2 border-gray-300
                opacity-0 group-hover:opacity-100
                transition-all duration-500
                group-hover:border-[#059669]
              '></div>
              <div className='
                absolute bottom-3 left-3 w-3 h-3
                border-b-2 border-l-2 border-gray-300
                opacity-0 group-hover:opacity-100
                transition-all duration-500
                group-hover:border-[#059669]
              '></div>
              <div className='
                absolute bottom-3 right-3 w-3 h-3
                border-b-2 border-r-2 border-gray-300
                opacity-0 group-hover:opacity-100
                transition-all duration-500
                group-hover:border-[#059669]
              '></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Feature;