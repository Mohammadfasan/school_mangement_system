// Testimonials.jsx
import React, { useState } from 'react';
import { testimonialData } from '../assets/images/assert.js';
import { 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  StarHalf 
} from 'lucide-react';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === testimonialData.testimonials.length - 1 ? 0 : prev + 1
    );
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonialData.testimonials.length - 1 : prev - 1
    );
  };

  const testimonial = testimonialData.testimonials[currentTestimonial];

  // Function to render star ratings with Lucide icons
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          className="w-5 h-5 text-yellow-400 fill-current" 
        />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf 
          key="half" 
          className="w-5 h-5 text-yellow-400 fill-current" 
        />
      );
    }
    
    // Add empty stars to complete 5 stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className="w-5 h-5 text-gray-300" 
        />
      );
    }
    
    return stars;
  };

  return (
    <div className="py-8 sm:py-12 bg-gray-50">
      <div className='text-center px-4 sm:px-6 mb-8 sm:mb-12'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#059669] mb-3 sm:mb-4 md:mb-6 leading-tight'>
          Testimonials
        </h2>
        <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 md:mb-16 px-2'>
          Hear from our satisfied students and parents about their experiences with our school management system.
        </p>
      </div>
      
      <div className="lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 relative">
          {/* Quote icon */}
          <div className="absolute -top-3 sm:-top-4 left-4 sm:left-8 bg-[#059669] text-white p-2 rounded-full">
            <Quote className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 md:gap-8">
            {/* Image */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-[#059669] flex-shrink-0">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              {/* Rating */}
              <div className="flex justify-center md:justify-start mb-3 sm:mb-4">
                <div className="flex items-center">
                  {renderStars(testimonial.rating)}
                  <span className="ml-2 text-xs sm:text-sm text-gray-500">
                    {testimonial.rating}/5
                  </span>
                </div>
              </div>
              
              {/* Testimonial text */}
              <blockquote className="text-base sm:text-lg md:text-xl text-gray-700 italic mb-4 sm:mb-6 leading-relaxed">
                "{testimonial.testimonialText}"
              </blockquote>
              
              {/* Name and title */}
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="font-bold text-lg sm:text-xl text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {testimonial.title}
                  </p>
                </div>
                
                {/* Navigation */}
                <div className="flex justify-center md:justify-end space-x-3 sm:space-x-4">
                  <button 
                    onClick={prevTestimonial}
                    className="p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#059669] focus:ring-opacity-50"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                  
                  <button 
                    onClick={nextTestimonial}
                    className="p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#059669] focus:ring-opacity-50"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
            {testimonialData.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-200 focus:outline-none ${
                  index === currentTestimonial ? 'bg-[#059669]' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;