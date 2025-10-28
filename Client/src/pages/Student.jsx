import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { Search, Users, User, UserCheck } from 'lucide-react';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statistics, setStatistics] = useState(null);

  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  useEffect(() => {
    fetchStudents();
    fetchStatistics();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, selectedGrade, selectedGender, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAllStudents();
      
      let studentsData = [];
      
      // Handle different response structures
      if (response.data) {
        if (response.data.students && Array.isArray(response.data.students)) {
          studentsData = response.data.students;
        }
        else if (Array.isArray(response.data)) {
          studentsData = response.data;
        }
        else if (response.data.data && response.data.data.students && Array.isArray(response.data.data.students)) {
          studentsData = response.data.data.students;
        }
        else if (response.data.data && Array.isArray(response.data.data)) {
          studentsData = response.data.data;
        }
      }
      
      setStudents(studentsData);
      
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      alert('Failed to fetch students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await studentService.getStudentStatistics();
      
      let statsData = {};
      
      if (response.data) {
        if (response.data.data) {
          statsData = response.data.data;
        } else {
          statsData = response.data;
        }
      }

      setStatistics(statsData);
      
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      setStatistics(null);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Filter by grade
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(student => student.grade === selectedGrade);
    }

    // Filter by gender
    if (selectedGender !== 'all') {
      filtered = filtered.filter(student => 
        student.gender?.toLowerCase() === selectedGender.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.parentName && student.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredStudents(filtered);
  };

  const getGenderDisplay = (gender) => {
    const genderMap = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other'
    };
    return genderMap[gender?.toLowerCase()] || gender || 'Not specified';
  };

  const getGenderColor = (gender) => {
    const genderLower = gender?.toLowerCase();
    const colorMap = {
      'male': 'bg-blue-100 text-blue-800',
      'female': 'bg-pink-100 text-pink-800',
      'other': 'bg-purple-100 text-purple-800'
    };
    return colorMap[genderLower] || 'bg-gray-100 text-gray-800';
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      '1': 'bg-green-100 text-green-800',
      '2': 'bg-blue-100 text-blue-800',
      '3': 'bg-yellow-100 text-yellow-800',
      '4': 'bg-red-100 text-red-800',
      '5': 'bg-purple-100 text-purple-800',
      '6': 'bg-indigo-100 text-indigo-800',
      '7': 'bg-pink-100 text-pink-800',
      '8': 'bg-orange-100 text-orange-800',
      '9': 'bg-teal-100 text-teal-800',
      '10': 'bg-cyan-100 text-cyan-800',
      '11': 'bg-lime-100 text-lime-800',
      '12': 'bg-amber-100 text-amber-800'
    };
    return gradeColors[grade] || 'bg-gray-100 text-gray-800';
  };

  // Safe statistic getters
  const getTotalStudents = () => {
    return statistics?.totalStudents || statistics?.data?.totalStudents || 0;
  };

  const getMaleCount = () => {
    const genderStats = statistics?.genderStats || statistics?.data?.genderStats || [];
    return genderStats.find(g => g._id === 'male')?.count || 0;
  };

  const getFemaleCount = () => {
    const genderStats = statistics?.genderStats || statistics?.data?.genderStats || [];
    return genderStats.find(g => g._id === 'female')?.count || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mt-40">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#059669] mb-4">
              Our Students
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the bright minds of our school community. Discover talented students across all grades.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{getTotalStudents()}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
            <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{getMaleCount()}</div>
            <div className="text-sm text-gray-600">Male Students</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
            <UserCheck className="h-8 w-8 text-pink-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-pink-600">{getFemaleCount()}</div>
            <div className="text-sm text-gray-600">Female Students</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by student name, address, or parent name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Grade Filter */}
            <div>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Grades</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedGrade !== 'all' && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(selectedGrade)} border`}>
                Grade {selectedGrade}
                <button 
                  onClick={() => setSelectedGrade('all')}
                  className="ml-2 hover:opacity-70 transition-opacity"
                >
                  ×
                </button>
              </span>
            )}
            {selectedGender !== 'all' && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGenderColor(selectedGender)} border`}>
                {getGenderDisplay(selectedGender)}
                <button 
                  onClick={() => setSelectedGender('all')}
                  className="ml-2 hover:opacity-70 transition-opacity"
                >
                  ×
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                Search: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-2 hover:opacity-70 transition-opacity"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-lg text-gray-700">
            Showing <span className="font-semibold text-green-600">{filteredStudents.length}</span> 
            {filteredStudents.length === 1 ? ' student' : ' students'}
            {selectedGrade !== 'all' && ` in Grade ${selectedGrade}`}
            {selectedGender !== 'all' && ` (${getGenderDisplay(selectedGender)})`}
          </p>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading students...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent Name
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student._id || student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getGradeColor(student.grade)}`}>
                            Grade {student.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getGenderColor(student.gender)}`}>
                            {getGenderDisplay(student.gender)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700 max-w-xs">
                            {student.address || 'Not specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {student.parentName || 'Not specified'}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center">
                          <Users size={48} className="text-gray-300 mb-2" />
                          <p className="text-lg font-medium text-gray-700 mb-1">No Students Found</p>
                          <p className="text-gray-500 max-w-md">
                            {searchTerm || selectedGrade !== 'all' || selectedGender !== 'all' 
                              ? "Try adjusting your search criteria or filters to find more students."
                              : "There are currently no students in the system."}
                          </p>
                          {(searchTerm || selectedGrade !== 'all' || selectedGender !== 'all') && (
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setSelectedGrade('all');
                                setSelectedGender('all');
                              }}
                              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              Clear All Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Student;