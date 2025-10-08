import { timetableData } from "../assets/images/assert.js";
import { useState } from 'react';

const Timetable = () => {
  const [selectedGrade, setSelectedGrade] = useState(timetableData.grades[0]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleSubjectClick = (subjectData) => {
    setSelectedSubject(subjectData);
  };

  const closeModal = () => {
    setSelectedSubject(null);
  };

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
  };

  // Mobile view - vertical layout
  const renderMobileTable = (data, title) => (
    <div className="mb-8 mt-6 lg:hidden">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      <div className="space-y-4">
        {data.map((row) => (
          <div key={row.period} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h4 className="font-semibold text-gray-700">Period {row.period}</h4>
            </div>
            <div className="space-y-2">
              {days.map((day, index) => (
                <div
                  key={day}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                    row[day]?.color || 'bg-gray-50'
                  }`}
                  onClick={() => row[day]?.subject && handleSubjectClick(row[day])}
                >
                  <span className="text-sm font-medium text-gray-600 w-16">
                    {fullDayNames[index]}
                  </span>
                  <span className={`text-sm font-semibold flex-1 text-center ${
                    row[day]?.subject ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {row[day]?.subject || '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Desktop view - horizontal table
  const renderDesktopTable = (data, title) => (
    <div className="mb-8 mt-6 hidden lg:block">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 border-b border-r border-gray-300 font-semibold text-gray-700">
                period
              </th>
              {dayHeaders.map((day) => (
                <th key={day} className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.period} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b border-r border-gray-300 font-medium text-center text-gray-600">
                  {row.period}
                </td>
                {days.map((day) => (
                  <td
                    key={day}
                    className={`py-3 px-4 border-b border-gray-300 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      row[day]?.color || 'bg-white'
                    }`}
                    onClick={() => row[day]?.subject && handleSubjectClick(row[day])}
                  >
                    {row[day]?.subject ? (
                      <div className="text-center">
                        <div className="font-semibold text-gray-800 text-sm">
                          {row[day].subject}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">-</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-4 px-3 sm:px-4 lg:py-8 lg:px-4 mt-30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#059669] mb-3 lg:mb-4">
            Welcome to Timetable
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed px-2">
            Students and teachers can see a color-coded weekly timetable grid, with days across the top and periods down the side. 
            Each subject box shows the subject. Hovering or clicking a subject gives more details.
          </p>
        </div>

        {/* Grade Selection */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 lg:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 lg:mb-4">Select Grade:</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {timetableData.grades.map((grade) => (
              <button
                key={grade.grade}
                onClick={() => handleGradeChange(grade)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  selectedGrade.grade === grade.grade
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Grade {grade.grade}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable for Selected Grade */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-6 space-y-3 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Grade : {selectedGrade.grade}</h2>
              <div className="flex flex-wrap gap-4 mt-1">
                <p className="text-gray-600 text-sm sm:text-base">Hall no: {selectedGrade.hallNo}</p>
                <p className="text-gray-600 text-sm sm:text-base">Room: {selectedGrade.room}</p>
              </div>
            </div>
          </div>

          {/* Mobile Timetable */}
          {renderMobileTable(selectedGrade.timetable, "Morning Sessions")}
          {renderMobileTable(selectedGrade.interval, "Afternoon Sessions")}

          {/* Desktop Timetable */}
          {renderDesktopTable(selectedGrade.timetable, "Morning Sessions")}
          
          {/* Interval Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">Interval</h3>
            {renderDesktopTable(selectedGrade.interval, "Afternoon Sessions")}
          </div>
        </div>

        {/* Subject Details Modal */}
        {selectedSubject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-sm sm:max-w-md w-full p-4 sm:p-6 mx-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                {selectedSubject.subject}
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Grade:</span>
                  <span className="text-gray-600">{selectedGrade.grade}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Room:</span>
                  <span className="text-gray-600">{selectedGrade.room}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Hall No:</span>
                  <span className="text-gray-600">{selectedGrade.hallNo}</span>
                </div>
              </div>
              <div className="flex justify-end mt-4 sm:mt-6">
                <button
                  onClick={closeModal}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;