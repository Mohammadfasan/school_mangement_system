import React, { useState } from 'react';
import { studentsData } from '../assets/images/assert';

const Student = () => {
  // Define the grades and initial state
  const grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4"];
  const [selectedGrade, setSelectedGrade] = useState("Grade 1"); 

  // Filter students based on the selected grade
  const filteredStudents = studentsData.students.filter(
    (student) => student.grade === selectedGrade
  );

  // --- Utility Classes and Styles (using Green) ---
  const buttonClass = (grade) => 
    `px-4 py-3 sm:px-6 sm:py-2 rounded-lg cursor-pointer transition-colors duration-200 text-sm font-semibold w-full sm:w-auto
     ${selectedGrade === grade 
        ? 'bg-green-500 text-white shadow-md'
        : 'bg-green-100 text-green-700 hover:bg-green-200'
      }`;

  // Container for the table structure on Lg screens and up
  const desktopTableContainerClass = 'hidden lg:block border-2 border-green-600 rounded-lg mt-6 overflow-hidden shadow-xl';
  
  // Container for the card structure on screens smaller than Lg
  const mobileCardContainerClass = 'block lg:hidden mt-6 space-y-4';

  // Desktop grid layout
  const gridLayoutClass = 'grid grid-cols-[1fr_2fr_1fr]'; 

  // Desktop header cell styles
  const headerCellClass = 'p-4 font-semibold text-left text-white bg-green-600 border-r border-green-700 last:border-r-0';
  
  // Desktop data cell styles
  const dataCellClass = 'p-4 text-left border-b border-r border-green-200 text-gray-700 last:border-r-0';
  const lastRowClass = 'border-b-0'; 

  // --- Mobile Card Rendering Function ---
  const renderMobileCards = () => (
    <div className={mobileCardContainerClass}>
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center sm:text-left">
        Grade {selectedGrade.split(' ')[1]} Students ({filteredStudents.length})
      </h3>
      
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-3">
          {filteredStudents.map((student, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-md border border-green-200 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Student Name - More prominent on mobile */}
              <div className="text-center sm:text-left mb-3 pb-2 border-b border-green-100">
                <h4 className="font-bold text-green-700 text-lg">{student.name}</h4>
              </div>
              
              {/* Student Details */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="font-semibold text-green-600 text-sm mb-1 sm:mb-0">Address:</span>
                  <span className="text-gray-700 text-sm sm:text-right break-words">{student.address}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="font-semibold text-green-600 text-sm mb-1 sm:mb-0">Grade:</span>
                  <span className="text-gray-700 text-sm">{student.grade}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="font-semibold text-green-600 text-sm mb-1 sm:mb-0">Gender:</span>
                  <span className="text-gray-700 text-sm">{student.gender}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">No students found for {selectedGrade}</p>
          <p className="text-gray-400 text-sm mt-2">Please select a different grade</p>
        </div>
      )}
    </div>
  );

  // --- Desktop Table Rendering Function ---
  const renderDesktopTable = () => (
    <div className={desktopTableContainerClass}>
      {/* Table Header */}
      <div className={gridLayoutClass} style={{ minHeight: '40px' }}>
        <div className={headerCellClass}>Name</div>
        <div className={headerCellClass}>Address</div>
        <div className={headerCellClass}>Gender</div>
      </div>

      {/* Data Rows */}
      <div className="min-h-[300px]"> 
        {filteredStudents.map((student, index) => {
          const isLastRow = index === filteredStudents.length - 1;
          return (
            <div key={index} className={`${gridLayoutClass}`}>
              <div className={`${dataCellClass} ${isLastRow ? lastRowClass : ''}`}>
                {student.name}
              </div>
              <div className={`${dataCellClass} ${isLastRow ? lastRowClass : ''}`}>
                {student.address}
              </div>
              <div className={`${dataCellClass} ${isLastRow ? lastRowClass : ''}`}>
                {student.gender}
              </div>
            </div>
          );
        })}

        {/* Fill remaining space with empty rows */}
        {Array.from({ length: Math.max(0, 8 - filteredStudents.length) }).map((_, index) => {
          const isLastPlaceholder = index === Math.max(0, 8 - filteredStudents.length) - 1;
          return (
            <div key={`empty-${index}`} className={gridLayoutClass}>
              <div className={`${dataCellClass} ${isLastPlaceholder ? lastRowClass : ''}`}>&nbsp;</div>
              <div className={`${dataCellClass} ${isLastPlaceholder ? lastRowClass : ''}`}>&nbsp;</div>
              <div className={`${dataCellClass} ${isLastPlaceholder ? lastRowClass : ''}`}>&nbsp;</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Title and Description Section */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#059669] mb-3 mt-30">
          Student Details
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed px-2">
          Students and teachers can view a card-based list of achievements earned in academics, sports, cultural,
          and other activities. Each achievement card shows the award title, student name, grade, date, and
          category. Color-coding helps to quickly identify achievement type.
        </p>
      </div>

      {/* Grade Filter Buttons - Mobile Responsive */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center sm:text-left">
          Select Grade:
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-start sm:space-x-4 sm:gap-0">
          {grades.map((grade) => (
            <button 
              key={grade}
              className={buttonClass(grade)}
              onClick={() => setSelectedGrade(grade)}
            >
              {grade.replace(' ', '')} 
            </button>
          ))}
        </div>
      </div>

      {/* Student Count - Mobile Friendly */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 sm:mb-6">
        <p className="text-green-700 text-center sm:text-left text-sm">
          Showing <span className="font-bold">{filteredStudents.length}</span> student(s) in {selectedGrade}
        </p>
      </div>

      {/* Render Desktop Table (lg:block) */}
      {renderDesktopTable()}

      {/* Render Mobile Cards (lg:hidden) */}
      {renderMobileCards()}

      {/* Empty State for No Students */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 mt-6">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Students Found</h3>
          <p className="text-gray-500">There are no students enrolled in {selectedGrade}.</p>
        </div>
      )}

    </div>
  );
};

export default Student;