// pages/Admin/Timetable.jsx
import React, { useState, useEffect } from 'react';
import { timetableService } from '../../services/timetableService';
import { Edit, Trash2, Plus, Search, Calendar, Clock, MapPin, Users, Download, Upload } from 'lucide-react';

const Timetable = () => {
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const dayHeaders = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    fetchGrades();
    fetchStatistics();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await timetableService.getAllGrades();
      setGrades(response.data.grades || response.data);
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

  const fetchStatistics = async () => {
    try {
      const response = await timetableService.getTimetableStats();
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleAddGrade = () => {
    setCurrentGrade({
      grade: '',
      hallNo: '',
      room: '',
      timetable: periods.map(period => ({
        period,
        monday: { subject: '', color: '' },
        tuesday: { subject: '', color: '' },
        wednesday: { subject: '', color: '' },
        thursday: { subject: '', color: '' },
        friday: { subject: '', color: '' }
      })),
      interval: [
        {
          period: 'Interval',
          monday: { subject: 'Break', color: 'bg-gray-100' },
          tuesday: { subject: 'Break', color: 'bg-gray-100' },
          wednesday: { subject: 'Break', color: 'bg-gray-100' },
          thursday: { subject: 'Break', color: 'bg-gray-100' },
          friday: { subject: 'Break', color: 'bg-gray-100' }
        }
      ]
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditGrade = (grade) => {
    setCurrentGrade(grade);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteGrade = async (gradeNumber) => {
    if (window.confirm(`Are you sure you want to delete Grade ${gradeNumber} timetable?`)) {
      try {
        await timetableService.deleteGrade(gradeNumber);
        alert('Grade timetable deleted successfully!');
        fetchGrades();
        fetchStatistics();
      } catch (error) {
        console.error('Error deleting grade:', error);
        alert('Failed to delete grade timetable');
      }
    }
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!currentGrade.grade || !currentGrade.hallNo || !currentGrade.room) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      if (isEditing) {
        // Update existing grade
        await timetableService.updateTimetableSlot(currentGrade);
        alert('Grade timetable updated successfully!');
      } else {
        // Create new grade
        await timetableService.createGrade(currentGrade);
        alert('New grade timetable created successfully!');
      }

      setIsModalOpen(false);
      setCurrentGrade(null);
      fetchGrades();
      fetchStatistics();
    } catch (error) {
      console.error('Error saving grade timetable:', error);
      alert(error.response?.data?.message || 'Failed to save grade timetable');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentGrade({ ...currentGrade, [name]: value });
  };

  const handleSubjectChange = (periodIndex, day, value) => {
    const updatedTimetable = [...currentGrade.timetable];
    updatedTimetable[periodIndex][day] = {
      ...updatedTimetable[periodIndex][day],
      subject: value,
      color: value ? getRandomColor() : ''
    };
    setCurrentGrade({ ...currentGrade, timetable: updatedTimetable });
  };

  const getRandomColor = () => {
    const colors = [
      'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100',
      'bg-purple-100', 'bg-indigo-100', 'bg-red-100', 'bg-teal-100'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const updateTimetableSlot = async (period, day, subject) => {
    try {
      setAdminLoading(true);
      await timetableService.updateTimetableSlot({
        grade: selectedGrade.grade,
        period,
        day,
        subject,
        color: getRandomColor()
      });
      
      // Refresh data
      fetchGrades();
    } catch (error) {
      console.error('Error updating timetable slot:', error);
      alert('Failed to update timetable slot');
    } finally {
      setAdminLoading(false);
    }
  };

  const clearTimetableSlot = async (period, day) => {
    try {
      setAdminLoading(true);
      await timetableService.clearTimetableSlot({
        grade: selectedGrade.grade,
        period,
        day
      });
      
      // Refresh data
      fetchGrades();
    } catch (error) {
      console.error('Error clearing timetable slot:', error);
      alert('Failed to clear timetable slot');
    } finally {
      setAdminLoading(false);
    }
  };

  if (loading && grades.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Timetable Management</h1>
          <p className="text-gray-600">Manage all grade timetables and schedules</p>
        </div>
        <button
          onClick={handleAddGrade}
          className="w-full lg:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add New Grade
        </button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-700">Total Grades</h3>
            <p className="text-2xl font-bold text-gray-900">{statistics.data?.totalGrades || grades.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-700">Active Periods</h3>
            <p className="text-2xl font-bold text-gray-900">{statistics.data?.totalPeriods || periods.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-gray-700">Weekly Classes</h3>
            <p className="text-2xl font-bold text-gray-900">{statistics.data?.weeklyClasses || '40+'}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-700">Subjects</h3>
            <p className="text-2xl font-bold text-gray-900">{statistics.data?.totalSubjects || '15+'}</p>
          </div>
        </div>
      )}

      {/* Grades List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Grades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {grades.map((grade) => (
            <div
              key={grade.grade}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedGrade?.grade === grade.grade
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => setSelectedGrade(grade)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">Grade {grade.grade}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditGrade(grade);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGrade(grade.grade);
                    }}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2" />
                  Hall: {grade.hallNo}
                </div>
                <div className="flex items-center">
                  <Users size={14} className="mr-2" />
                  Room: {grade.room}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timetable Editor */}
      {selectedGrade && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Grade {selectedGrade.grade} Timetable
              </h2>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>Hall: {selectedGrade.hallNo}</span>
                <span>Room: {selectedGrade.room}</span>
              </div>
            </div>
          </div>

          {/* Timetable Table */}
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
                {selectedGrade.timetable.map((row) => (
                  <tr key={row.period} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-r border-gray-300 font-medium text-center text-gray-600">
                      {row.period}
                    </td>
                    {days.map((day) => (
                      <td
                        key={day}
                        className={`py-3 px-4 border-b border-gray-300 ${
                          row[day]?.color || 'bg-white'
                        }`}
                      >
                        <div className="flex flex-col space-y-2">
                          <input
                            type="text"
                            value={row[day]?.subject || ''}
                            onChange={(e) => updateTimetableSlot(row.period, day, e.target.value)}
                            placeholder="Enter subject"
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            disabled={adminLoading}
                          />
                          {row[day]?.subject && (
                            <button
                              onClick={() => clearTimetableSlot(row.period, day)}
                              className="text-xs text-red-600 hover:text-red-800"
                              disabled={adminLoading}
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Interval Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Interval</h3>
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
                  {selectedGrade.interval.map((row) => (
                    <tr key={row.period} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b border-r border-gray-300 font-medium text-center text-gray-600">
                        {row.period}
                      </td>
                      {days.map((day) => (
                        <td
                          key={day}
                          className={`py-3 px-4 border-b border-gray-300 text-center ${
                            row[day]?.color || 'bg-gray-100'
                          }`}
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {row[day]?.subject || 'Break'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Grade Modal */}
      {isModalOpen && currentGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {isEditing ? 'Edit Grade Timetable' : 'Add New Grade Timetable'}
            </h2>
            <form onSubmit={handleSaveGrade}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                    Grade Number *
                  </label>
                  <input
                    type="text"
                    name="grade"
                    id="grade"
                    value={currentGrade.grade}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    disabled={isEditing}
                  />
                </div>

                <div>
                  <label htmlFor="hallNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Hall Number *
                  </label>
                  <input
                    type="text"
                    name="hallNo"
                    id="hallNo"
                    value={currentGrade.hallNo}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    name="room"
                    id="room"
                    value={currentGrade.room}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {/* Timetable Editor in Modal */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Timetable Setup</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-3 border-b border-r border-gray-300 font-semibold text-gray-700 text-sm">
                          Period
                        </th>
                        {dayHeaders.map((day) => (
                          <th key={day} className="py-2 px-3 border-b border-gray-300 font-semibold text-gray-700 text-sm">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentGrade.timetable.map((row, periodIndex) => (
                        <tr key={row.period}>
                          <td className="py-2 px-3 border-b border-r border-gray-300 font-medium text-center text-gray-600 text-sm">
                            {row.period}
                          </td>
                          {days.map((day) => (
                            <td key={day} className="py-2 px-3 border-b border-gray-300">
                              <input
                                type="text"
                                value={row[day]?.subject || ''}
                                onChange={(e) => handleSubjectChange(periodIndex, day, e.target.value)}
                                placeholder="Subject"
                                className="w-full p-1 border border-gray-300 rounded text-sm"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {isEditing ? 'Update Timetable' : 'Create Timetable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;