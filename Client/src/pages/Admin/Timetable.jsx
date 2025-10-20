// src/pages/Admin/Timetable.jsx

import React, { useState, useEffect } from 'react';
import { timetableData as initialData } from '../../assets/images/assert.js'; // Using static data for this example

const Timetable = () => {
  const [timetableData, setTimetableData] = useState(initialData);

  const [selectedGrade, setSelectedGrade] = useState('11');
  const [hallNo, setHallNo] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1');
  const [selectedDay, setSelectedDay] = useState('monday');
  const [subject, setSubject] = useState('');

  // CHANGED: Added state to track the visible day on mobile
  const [selectedMobileDay, setSelectedMobileDay] = useState('monday');

  useEffect(() => {
    const gradeInfo = timetableData.grades.find(g => g.grade === selectedGrade);
    if (gradeInfo) {
      setHallNo(gradeInfo.hallNo);
    }
  }, [selectedGrade, timetableData]);

  const handleGradeChange = (e) => {
    setSelectedGrade(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject) {
      alert('Please enter a subject.');
      return;
    }

    const periodNum = parseInt(selectedPeriod, 10);
    const updatedTimetableData = JSON.parse(JSON.stringify(timetableData));
    const gradeToUpdate = updatedTimetableData.grades.find(g => g.grade === selectedGrade);
    if (!gradeToUpdate) return;

    const targetArray = periodNum <= 4 ? 'timetable' : 'interval';
    
    const periodToUpdate = gradeToUpdate[targetArray].find(
      p => p.period.toString() === selectedPeriod
    );

    if (periodToUpdate) {
      periodToUpdate[selectedDay] = {
        subject: subject,
        color: 'bg-yellow-100', 
      };
      
      setTimetableData(updatedTimetableData);
      alert('Timetable updated successfully!');
      setSubject('');
    } else {
      alert('Selected period not found.');
    }
  };
  
  const currentGradeData = timetableData.grades.find(g => g.grade === selectedGrade);
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const dayHeaders = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to TimeTable Management</h1>

      {/* Form for Updating Timetable */}
      {/* CHANGED: Added p-4 for smaller screens, sm:p-6 for larger */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Timetable Slot</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Responsive grid for form (already responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select 
                id="grade" 
                value={selectedGrade} 
                onChange={handleGradeChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm"
              >
                {timetableData.grades.map(g => (
                  <option key={g.grade} value={g.grade}>{`Grade ${g.grade}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="hallNo" className="block text-sm font-medium text-gray-700 mb-1">Hall No.</label>
              <input 
                type="text" 
                id="hallNo" 
                value={hallNo} 
                readOnly 
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <select 
                id="day" 
                value={selectedDay} 
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm"
              >
                {days.map((day, i) => (
                  <option key={day} value={day}>{dayHeaders[i]}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select 
                id="period" 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm"
              >
                {currentGradeData && [...currentGradeData.timetable, ...currentGradeData.interval].map(p => (
                  <option key={p.period} value={p.period}>{p.period}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input 
                type="text" 
                id="subject" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm"
                placeholder="Enter subject name (e.g., Math)"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Update Slot
            </button>
          </div>
        </form>
      </div>

       {/* Display Current Timetable */}
       <div className="mt-12 max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            Current Timetable for Grade {selectedGrade}
          </h2>

          {/* === START: NEW MOBILE CARD VIEW === */}
          {/* This div is visible by default and hidden on 'md' screens and up */}
          <div className="md:hidden space-y-3">
            {/* Day Selector Tabs */}
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              {days.map((day, i) => (
                <button
                  key={day}
                  onClick={() => setSelectedMobileDay(day)}
                  className={`w-full rounded-md py-2 text-sm font-medium transition-colors
                    ${selectedMobileDay === day ? 'bg-white shadow text-green-700' : 'text-gray-600 hover:bg-gray-200'}
                  `}
                >
                  {dayHeaders[i].substring(0, 3)} {/* "Mon", "Tue", etc. */}
                </button>
              ))}
            </div>

            {/* Daily List View */}
            {currentGradeData && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {[...currentGradeData.timetable, ...currentGradeData.interval].map(row => (
                    <li key={row.period} className="flex items-center justify-between p-3">
                      <div className="flex items-center">
                        <span className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-100 text-gray-700 font-semibold flex items-center justify-center text-sm">
                          {row.period}
                        </span>
                        <span className="ml-3 font-medium text-gray-800">
                          {row[selectedMobileDay]?.subject || '-'}
                        </span>
                      </div>
                      {row[selectedMobileDay]?.subject && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row[selectedMobileDay]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {row[selectedMobileDay].subject.split(' ')[0]}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b border-r text-gray-600 font-semibold">Period</th>
                  {dayHeaders.map(day => (
                    <th key={day} className="py-3 px-4 border-b text-gray-600 font-semibold">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentGradeData && [...currentGradeData.timetable, ...currentGradeData.interval].map(row => (
                  <tr key={row.period} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-r font-medium text-center text-gray-700">{row.period}</td>
                    {days.map(day => (
                      <td key={day} className={`py-3 px-4 border-b text-center ${row[day]?.color || 'bg-white'}`}>
                        {row[day]?.subject || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* === END: ORIGINAL TABLE VIEW (Now for Desktop) === */}
       </div>
    </div>
  );
};

export default Timetable;