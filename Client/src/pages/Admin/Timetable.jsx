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

  // FIXED: Proper API response handling
  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await timetableService.getAllGrades();
      console.log('📊 Raw API response:', response);
      
      // Handle different response structures safely
      let fetchedGrades = [];
      
      if (response.data && response.data.success) {
        // Structure: { success: true, data: { grades: [...] } }
        fetchedGrades = response.data.data?.grades || response.data.grades || [];
      } else if (Array.isArray(response.data)) {
        // Structure: { data: [...] }
        fetchedGrades = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Structure: { data: { data: [...] } }
        fetchedGrades = response.data.data;
      } else if (Array.isArray(response.data?.grades)) {
        // Structure: { data: { grades: [...] } }
        fetchedGrades = response.data.grades;
      }
      
      console.log('✅ Processed grades:', fetchedGrades);
      
      // Ensure it's always an array
      if (!Array.isArray(fetchedGrades)) {
        console.warn('⚠️ Grades is not an array, converting:', fetchedGrades);
        fetchedGrades = [];
      }
      
      setGrades(fetchedGrades);
      
      // Select first grade if available
      if (fetchedGrades.length > 0) {
        setSelectedGrade(fetchedGrades[0]);
      } else {
        setSelectedGrade(null);
      }
      
    } catch (error) {
      console.error('❌ Error fetching grades:', error);
      alert('Failed to fetch grades');
      setGrades([]); // Set empty array on error
      setSelectedGrade(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await timetableService.getTimetableStats();
      console.log('📈 Stats response:', response);
      
      // Handle different response structures
      const statsData = response.data?.data || response.data || {};
      setStatistics(statsData);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStatistics({});
    }
  };
  
  const initializeNewTimetable = () => {
    const newTimetable = {};
    periods.forEach(period => {
      newTimetable[period] = {};
      days.forEach(day => {
        newTimetable[period][day] = { subject: '' };
      });
    });
    return newTimetable;
  };
  
  const getNewGradeTemplate = () => ({
    grade: '',
    hallNo: '',
    room: '',
    timetable: [
      { period: '1', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '2', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '3', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '4', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} }
    ],
    interval: [
      { period: '5', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '6', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} },
      { period: '7', monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {} }
    ]
  });

  const handleAddNew = () => {
    setCurrentGrade(getNewGradeTemplate());
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentGrade(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (periodIndex, day, subject, isInterval = false) => {
    setCurrentGrade(prev => {
      const newGrade = { ...prev };
      const targetArray = isInterval ? 'interval' : 'timetable';
      
      if (newGrade[targetArray] && newGrade[targetArray][periodIndex]) {
        newGrade[targetArray][periodIndex][day] = { 
          subject: subject,
          color: subject ? 'bg-blue-100' : ''
        };
      }
      
      return newGrade;
    });
  };

  const handleDeleteGrade = async (gradeToDelete) => {
    if (!gradeToDelete || !gradeToDelete.grade) {
      alert("No grade selected to delete.");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete Grade ${gradeToDelete.grade}?`)) {
      try {
        setLoading(true);
        await timetableService.deleteGrade(gradeToDelete.grade);
        alert('Grade deleted successfully');
        fetchGrades(); // Refresh the grades list
      } catch (error) {
        console.error('Error deleting grade:', error);
        alert('Failed to delete grade: ' + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    }
  };

  const handleEdit = (gradeToEdit) => {
    if (!gradeToEdit) {
      alert("No grade selected to edit.");
      return;
    }
    // Deep copy the selected grade to avoid modifying state directly
    setCurrentGrade(JSON.parse(JSON.stringify(gradeToEdit)));
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentGrade.grade || !currentGrade.hallNo || !currentGrade.room) {
      alert('Please fill in all required fields: Grade, Hall No, and Room');
      return;
    }
    
    setAdminLoading(true); 
    try {
      if (isEditing) {
        await timetableService.updateTimetable(currentGrade);
        alert('Timetable updated successfully!');
      } else {
        await timetableService.createGrade(currentGrade);
        alert('Timetable created successfully!');
      }
      
      setIsModalOpen(false); 
      fetchGrades(); 
      
    } catch (error) {
      console.error('Error saving timetable:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} timetable. Error: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setAdminLoading(false); 
    }
  };

  // FIXED: Safer statistic access
  const getStat = (key) => {
    if (loading || !statistics) return '...';
    
    switch (key) {
      case 'subjects':
        return statistics.totalSubjects || 0;
      case 'grades':
        return statistics.totalGrades || (Array.isArray(grades) ? grades.length : 0);
      case 'periods':
        return statistics.totalPeriods || 7;
      case 'classes':
        return statistics.weeklyClasses || 0;
      default:
        return 0;
    }
  };

  // FIXED: Render timetable data safely
  const renderTimetableRow = (periodData, isInterval = false) => {
    if (!periodData || !Array.isArray(periodData)) return null;
    
    return periodData.map((periodObj) => (
      <tr key={`${isInterval ? 'interval-' : 'timetable-'}${periodObj.period}`}>
        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border">
          Period {periodObj.period} {isInterval && '(Afternoon)'}
        </td>
        {days.map(day => (
          <td key={day} className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 border">
            {periodObj[day]?.subject || '---'}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="pt-6 ">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Timetable Management</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Calendar size={24} />} title="Total Grades" value={getStat('grades')} />
        <StatCard icon={<Users size={24} />} title="Total Subjects" value={getStat('subjects')} />
        <StatCard icon={<Clock size={24} />} title="Total Periods" value={getStat('periods')} />
        <StatCard icon={<MapPin size={24} />} title="Weekly Classes" value={getStat('classes')} />
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <label htmlFor="gradeSelect" className="text-sm font-medium text-gray-700">Select Grade:</label>
            <select
              id="gradeSelect"
              className="p-2 border border-gray-300 rounded-lg"
              onChange={(e) => {
                const gradeObj = grades.find(g => g.grade === e.target.value);
                setSelectedGrade(gradeObj);
              }}
              value={selectedGrade?.grade || ''} 
              disabled={loading || grades.length === 0}
            >
              {loading ? (
                <option>Loading...</option>
              ) : grades.length === 0 ? (
                <option>No grades found</option>
              ) : (
                grades.map(g => (
                  <option key={g.grade} value={g.grade}>Grade {g.grade}</option>
                ))
              )}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleAddNew} 
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={18} className="mr-2" /> Add New Grade
            </button>
            <button 
              onClick={() => handleEdit(selectedGrade)} 
              disabled={!selectedGrade} 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Edit size={18} className="mr-2" /> Edit
            </button>
            <button 
              onClick={() => handleDeleteGrade(selectedGrade)} 
              disabled={!selectedGrade} 
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <Trash2 size={18} className="mr-2" /> Delete
            </button>
          </div>
        </div>

        {/* Timetable Display */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading timetable...</p>
            </div>
          ) : selectedGrade ? (
            <div className="border rounded-lg">
              {/* Grade Info */}
              <div className="bg-gray-50 p-4 border-b">
                <h3 className="text-lg font-semibold">Grade {selectedGrade.grade}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <span>Hall No: {selectedGrade.hallNo || 'N/A'}</span>
                  <span>Room: {selectedGrade.room || 'N/A'}</span>
                </div>
              </div>

              {/* Timetable Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Period</th>
                    {dayHeaders.map(day => (
                      <th key={day} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Morning Sessions */}
                  {selectedGrade.timetable && renderTimetableRow(selectedGrade.timetable, false)}
                  
                  {/* Afternoon Sessions */}
                  {selectedGrade.interval && renderTimetableRow(selectedGrade.interval, true)}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No timetable selected. Please add a new grade or select an existing one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && currentGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Timetable' : 'Create New Timetable'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade *</label>
                  <input
                    type="text"
                    name="grade"
                    id="grade"
                    placeholder="e.g., 1, 2, 3"
                    value={currentGrade.grade}
                    onChange={handleInputChange}
                    disabled={isEditing} 
                    className="w-full p-2 border border-gray-300 rounded mt-1 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="hallNo" className="block text-sm font-medium text-gray-700">Hall No *</label>
                  <input
                    type="text"
                    name="hallNo"
                    id="hallNo"
                    placeholder="e.g., A101"
                    value={currentGrade.hallNo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="room" className="block text-sm font-medium text-gray-700">Room *</label>
                  <input
                    type="text"
                    name="room"
                    id="room"
                    placeholder="e.g., Room 1"
                    value={currentGrade.room}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>
              </div>

              {/* Morning Sessions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Morning Sessions (Periods 1-4)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Period</th>
                        {dayHeaders.map(day => (
                          <th key={day} className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentGrade.timetable?.map((periodObj, index) => (
                        <tr key={`timetable-${periodObj.period}`}>
                          <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            P{periodObj.period}
                          </td>
                          {days.map(day => (
                            <td key={day} className="px-2 py-1 border">
                              <input
                                type="text"
                                value={periodObj[day]?.subject || ''}
                                onChange={(e) => handleSubjectChange(index, day, e.target.value, false)}
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

              {/* Afternoon Sessions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Afternoon Sessions (Periods 5-7)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Period</th>
                        {dayHeaders.map(day => (
                          <th key={day} className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentGrade.interval?.map((periodObj, index) => (
                        <tr key={`interval-${periodObj.period}`}>
                          <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            P{periodObj.period}
                          </td>
                          {days.map(day => (
                            <td key={day} className="px-2 py-1 border">
                              <input
                                type="text"
                                value={periodObj[day]?.subject || ''}
                                onChange={(e) => handleSubjectChange(index, day, e.target.value, true)}
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

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {adminLoading ? 'Saving...' : (isEditing ? 'Update Timetable' : 'Create Timetable')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// StatCard component
const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
    <div className="p-3 rounded-full bg-green-100 text-green-600">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Timetable;