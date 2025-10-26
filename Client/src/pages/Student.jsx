import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { Search, Filter, Users, MapPin, Calendar } from 'lucide-react';

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
      setStudents(response.data.students || response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await studentService.getStudentStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
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
      filtered = filtered.filter(student => student.gender === selectedGender);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredStudents(filtered);
  };

  const getGradeDisplayName = (grade) => {
    return `Grade ${grade}`;
  };

  const getGenderDisplay = (gender) => {
    const genderMap = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other'
    };
    return genderMap[gender] || gender;
  };

  const getGenderColor = (gender) => {
    const colorMap = {
      'male': 'bg-blue-100 text-blue-800 border-blue-200',
      'female': 'bg-pink-100 text-pink-800 border-pink-200',
      'other': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colorMap[gender] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      '1': 'bg-green-100 text-green-800 border-green-200',
      '2': 'bg-blue-100 text-blue-800 border-blue-200',
      '3': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      '4': 'bg-red-100 text-red-800 border-red-200',
      '5': 'bg-purple-100 text-purple-800 border-purple-200',
      '6': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      '7': 'bg-pink-100 text-pink-800 border-pink-200',
      '8': 'bg-orange-100 text-orange-800 border-orange-200',
      '9': 'bg-teal-100 text-teal-800 border-teal-200',
      '10': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      '11': 'bg-lime-100 text-lime-800 border-lime-200',
      '12': 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return gradeColors[grade] || 'bg-gray-100 text-gray-800 border-gray-200';
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
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Students
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the bright minds of our school community. Discover talented students across all grades 
              who are achieving excellence in academics, sports, and extracurricular activities.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      {statistics && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{statistics.data?.totalStudents || 0}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.data?.genderStats?.find(g => g._id === 'male')?.count || 0}
              </div>
              <div className="text-sm text-gray-600">Male Students</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">
                {statistics.data?.genderStats?.find(g => g._id === 'female')?.count || 0}
              </div>
              <div className="text-sm text-gray-600">Female Students</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.data?.gradeStats?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Active Grades</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, address, or email..."
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
                  <option key={grade} value={grade}>{getGradeDisplayName(grade)}</option>
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
                <option value="other">Other</option>
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
                  className="ml-2 hover:opacity-70"
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
                  className="ml-2 hover:opacity-70"
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
                  className="ml-2 hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-lg text-gray-700">
            Showing <span className="font-semibold text-green-600">{filteredStudents.length}</span> 
            {filteredStudents.length === 1 ? ' student' : ' students'}
            {selectedGrade !== 'all' && ` in Grade ${selectedGrade}`}
            {selectedGender !== 'all' && ` (${getGenderDisplay(selectedGender)})`}
          </p>
        </div>

        {/* Students Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map((student) => (
              <div 
                key={student._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Student Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{student.name}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(student.grade)} border`}>
                        Grade {student.grade}
                      </span>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getGenderColor(student.gender)} border`}>
                      {getGenderDisplay(student.gender)}
                    </span>
                  </div>
                </div>

                {/* Student Details */}
                <div className="px-6 pb-6">
                  {/* Address */}
                  <div className="flex items-start mb-4">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Address</p>
                      <p className="text-sm text-gray-600 mt-1">{student.address}</p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  {(student.email || student.phone) && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Contact</p>
                      <div className="space-y-1">
                        {student.email && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">📧</span>
                            {student.email}
                          </p>
                        )}
                        {student.phone && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">📞</span>
                            {student.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Parent Information */}
                  {(student.parentName || student.parentPhone) && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Parent Info</p>
                      <div className="space-y-1">
                        {student.parentName && (
                          <p className="text-sm text-gray-600">👨‍👩‍👧‍👦 {student.parentName}</p>
                        )}
                        {student.parentPhone && (
                          <p className="text-sm text-gray-600">📞 {student.parentPhone}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Students Found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
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
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Grade Distribution Chart (Simplified) */}
        {statistics?.data?.gradeStats && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Students by Grade</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {statistics.data.gradeStats.map((gradeStat) => (
                <div key={gradeStat._id} className="text-center">
                  <div className={`h-16 rounded-lg flex items-center justify-center mb-2 ${getGradeColor(gradeStat._id)}`}>
                    <span className="text-2xl font-bold">{gradeStat.count}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Grade {gradeStat._id}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;