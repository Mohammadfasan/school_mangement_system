import React, { useState, useEffect } from 'react';
import { timetableService } from '../services/timetableService';
import { useAuth } from '../Context/AuthContext';
import { Calendar } from 'lucide-react';

const Timetable = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [gradesData, setGradesData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Admin state
  const [hallNo, setHallNo] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1');
  const [selectedDay, setSelectedDay] = useState('monday');
  const [subject, setSubject] = useState('');
  const [selectedMobileDay, setSelectedMobileDay] = useState('monday');
  const [adminLoading, setAdminLoading] = useState(false);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Fetch grades from backend
  useEffect(() => {
    fetchGrades();
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      setHallNo(selectedGrade.hallNo);
    }
  }, [selectedGrade]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await timetableService.getAllGrades();
      setGradesData(response.data.grades || response.data);
      if (response.data.grades?.length > 0 || response.data.length > 0) {
        setSelectedGrade(response.data.grades?.[0] || response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
      alert('Failed to fetch timetable data');
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    try {
      setLoading(true);
      await timetableService.createDefaultGrades();
      alert('Sample timetable created successfully!');
      fetchGrades();
    } catch (error) {
      console.error('Error creating sample data:', error);
      alert('Failed to create sample timetable');
    }
  };

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

  // Admin functions
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!subject) {
      alert('Please enter a subject.');
      return;
    }

    try {
      setAdminLoading(true);
      await timetableService.updateTimetableSlot({
        grade: selectedGrade.grade,
        period: selectedPeriod,
        day: selectedDay,
        subject: subject,
        color: 'bg-yellow-100'
      });
      
      alert('Timetable updated successfully!');
      setSubject('');
      // Refresh data
      fetchGrades();
    } catch (error) {
      console.error('Error updating timetable:', error);
      alert('Failed to update timetable');
    } finally {
      setAdminLoading(false);
    }
  };

  const clearSlot = async () => {
    try {
      setAdminLoading(true);
      await timetableService.clearTimetableSlot({
        grade: selectedGrade.grade,
        period: selectedPeriod,
        day: selectedDay
      });
      
      alert('Timetable slot cleared successfully!');
      // Refresh data
      fetchGrades();
    } catch (error) {
      console.error('Error clearing timetable slot:', error);
      alert('Failed to clear timetable slot');
    } finally {
      setAdminLoading(false);
    }
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
                Period
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

  // Admin Mobile Card View
  const renderAdminMobileView = () => (
    <div className="md:hidden space-y-3 mb-6">
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
        {days.map((day, i) => (
          <button
            key={day}
            onClick={() => setSelectedMobileDay(day)}
            className={`w-full rounded-md py-2 text-sm font-medium transition-colors
              ${selectedMobileDay === day ? 'bg-white shadow text-green-700' : 'text-gray-600 hover:bg-gray-200'}
            `}
          >
            {dayHeaders[i]}
          </button>
        ))}
      </div>

      {selectedGrade && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {[...selectedGrade.timetable, ...selectedGrade.interval].map(row => (
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
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Always Show This */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            School Timetable
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay organized and never miss a class with our comprehensive weekly timetable overview. 
            View schedules for all grades and manage your academic routine efficiently.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Welcome Message */}
        {isAuthenticated && user && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="text-left">
                <p className="text-green-800 font-semibold">
                  Welcome back, {user.name || 'User'}!
                </p>
                <p className="text-green-600 text-sm">
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>
          </div>
        )}

        {!selectedGrade ? (
          // Show when no data is available
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Timetable Data Available
              </h2>
              <p className="text-gray-600 mb-6">
                There are no timetable entries yet. {isAuthenticated ? 'Add some grades or create sample data to get started.' : 'Please check back later.'}
              </p>
              {isAuthenticated && (
                <button
                  onClick={createSampleData}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Sample Timetable
                </button>
              )}
            </div>
          </div>
        ) : (
          // Show when data is available
          <>
            {/* Admin Controls */}
            {isAuthenticated && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Timetable Slot</h2>
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                      <select 
                        value={selectedGrade?.grade || ''} 
                        onChange={(e) => {
                          const grade = gradesData.find(g => g.grade === e.target.value);
                          setSelectedGrade(grade);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {gradesData.map(g => (
                          <option key={g.grade} value={g.grade}>{`Grade ${g.grade}`}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                      <select 
                        value={selectedDay} 
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {days.map((day, i) => (
                          <option key={day} value={day}>{fullDayNames[i]}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                      <select 
                        value={selectedPeriod} 
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {selectedGrade && [...selectedGrade.timetable, ...selectedGrade.interval].map(p => (
                          <option key={p.period} value={p.period}>{p.period}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input 
                        type="text" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter subject"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={clearSlot}
                      disabled={adminLoading}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Clear Slot
                    </button>
                    <button
                      type="submit"
                      disabled={adminLoading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {adminLoading ? 'Updating...' : 'Update Slot'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Grade Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Grade:</h3>
              <div className="flex flex-wrap gap-3">
                {gradesData.map((grade) => (
                  <button
                    key={grade.grade}
                    onClick={() => handleGradeChange(grade)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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

            {/* Timetable Display */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Grade {selectedGrade.grade}</h2>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <p className="text-gray-600">Hall no: {selectedGrade.hallNo}</p>
                    <p className="text-gray-600">Room: {selectedGrade.room}</p>
                  </div>
                </div>
              </div>

              {/* Admin Mobile View */}
              {isAuthenticated && renderAdminMobileView()}

              {/* Student Mobile Timetable */}
              {!isAuthenticated && (
                <>
                  {renderMobileTable(selectedGrade.timetable, "Morning Sessions")}
                  {renderMobileTable(selectedGrade.interval, "Afternoon Sessions")}
                </>
              )}

              {/* Desktop Timetable */}
              {renderDesktopTable(selectedGrade.timetable, "Morning Sessions")}
              
              {/* Interval Section */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Interval</h3>
                {renderDesktopTable(selectedGrade.interval, "Afternoon Sessions")}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Subject Details Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedSubject.subject}
            </h3>
            <div className="space-y-3">
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
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;