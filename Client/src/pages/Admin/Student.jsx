// pages/Admin/Student.jsx
import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../Context/AuthContext';
import { Edit, Trash2, Plus, Search, Filter, Download, Upload, Users, User, UserMinus } from 'lucide-react';

// --- Helper Components ---
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

// --- Main Student Component ---
const initialFormState = {
  id: null,
  name: '',
  email: '',
  address: '',
  grade: '1',
  gender: 'Male',
  phone: '',
  parentPhone: '',
  parentName: '',
  dateOfBirth: ''
};

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statistics, setStatistics] = useState({});
  const [adminLoading, setAdminLoading] = useState(false);

  const { user } = useAuth();
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  useEffect(() => {
    fetchStudents();
    fetchStatistics();
  }, []);

  // Improved fetchStudents function
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAllStudents();
      
      console.log('🔍 [Admin Student] Full API response:', response);
      console.log('📊 [Admin Student] response.data:', response.data);
      
      let studentsData = [];
      
      // Handle different response structures
      if (response.data) {
        // Case 1: response.data.students array
        if (response.data.students && Array.isArray(response.data.students)) {
          studentsData = response.data.students;
          console.log('✅ Using response.data.students');
        }
        // Case 2: response.data is direct array
        else if (Array.isArray(response.data)) {
          studentsData = response.data;
          console.log('✅ Using response.data (direct array)');
        }
        // Case 3: response.data.data.students
        else if (response.data.data && response.data.data.students && Array.isArray(response.data.data.students)) {
          studentsData = response.data.data.students;
          console.log('✅ Using response.data.data.students');
        }
        // Case 4: response.data.data is array
        else if (response.data.data && Array.isArray(response.data.data)) {
          studentsData = response.data.data;
          console.log('✅ Using response.data.data');
        }
      }
      
      console.log('👥 Final students data:', studentsData);
      setStudents(studentsData);
      
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      alert('Failed to fetch students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Improved fetchStatistics function
  const fetchStatistics = async () => {
    try {
      const response = await studentService.getStudentStatistics();
      
      console.log('📈 [Admin Student] Statistics response:', response);
      
      let statsData = {};
      
      // Handle different response structures
      if (response.data) {
        if (response.data.data) {
          statsData = response.data.data; // For nested data structure
          console.log('✅ Using response.data.data for stats');
        } else {
          statsData = response.data; // For direct data
          console.log('✅ Using response.data for stats');
        }
      }

      console.log('📊 Processed statsData:', statsData);

      // Process gender stats with better handling
      const genderStats = statsData.genderStats || [];
      console.log('🚻 Gender stats:', genderStats);
      
      const maleCount = genderStats.find(g => g._id === 'male')?.count || 0;
      const femaleCount = genderStats.find(g => g._id === 'female')?.count || 0;
      
      const finalStats = {
        totalStudents: statsData.totalStudents || 0,
        male: maleCount,
        female: femaleCount
      };
      
      console.log('🎯 Final statistics:', finalStats);
      setStatistics(finalStats);
      
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      setStatistics({
        totalStudents: 0,
        male: 0,
        female: 0
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent(prev => ({ ...prev, [name]: value }));
  };
  
  const resetFormAndCloseModal = () => {
    setCurrentStudent(initialFormState);
    setIsEditing(false);
    setIsModalOpen(false);
    setAdminLoading(false);
  };

  const handleAdd = () => {
    setCurrentStudent(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    console.log('✏️ Editing student:', student);
    
    // Convert backend gender format to frontend format
    const formattedGender = student.gender === 'male' ? 'Male' : 
                           student.gender === 'female' ? 'Female' : 'Male';
    
    // Format date for input if exists
    const formattedDate = student.dateOfBirth ? 
      new Date(student.dateOfBirth).toISOString().split('T')[0] : '';
    
    setCurrentStudent({
      ...initialFormState,
      ...student,
      id: student._id || student.id,
      gender: formattedGender,
      dateOfBirth: formattedDate
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(studentId);
        alert('Student deleted successfully!');
        fetchStudents();
        fetchStatistics();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdminLoading(true);

    try {
      // Prepare data for backend - convert gender format
      const studentData = { 
        ...currentStudent,
        gender: currentStudent.gender.toLowerCase() // Convert to backend format
      };
      
      // Remove id for create operation
      delete studentData.id;

      console.log('📤 Submitting student data:', studentData);

      if (isEditing) {
        await studentService.updateStudent(currentStudent.id, studentData);
        alert('Student updated successfully!');
      } else {
        await studentService.createStudent(studentData);
        alert('Student created successfully!');
      }
      
      resetFormAndCloseModal();
      fetchStudents();
      fetchStatistics();
      
    } catch (error) {
      console.error('❌ Error saving student:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to save student: ${errorMessage}`);
    } finally {
      setAdminLoading(false);
    }
  };

  // Enhanced filter logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
    
    // Handle both frontend and backend gender formats
    const studentGender = student.gender?.toLowerCase();
    const filterGender = genderFilter.toLowerCase();
    const matchesGender = genderFilter === 'all' || 
                         studentGender === filterGender ||
                         (studentGender === 'male' && filterGender === 'male') ||
                         (studentGender === 'female' && filterGender === 'female');
    
    return matchesSearch && matchesGrade && matchesGender;
  });

  // Helper to get stat value safely
  const getStat = (key) => {
    if (loading || !statistics) return '...';
    return statistics[key] !== undefined ? statistics[key] : 0;
  };

  return (
    <div>
      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<Users size={24} />} title="Total Students" value={getStat('totalStudents')} />
        <StatCard icon={<User size={24} />} title="Male Students" value={getStat('male')} />
        <StatCard icon={<UserMinus size={24} />} title="Female Students" value={getStat('female')} />
      </div>

      {/* Main Content Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Manage Students</h2>
          <button
            onClick={handleAdd}
            className="flex items-center mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={18} className="mr-2" /> Add New Student
          </button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Grades</option>
            {grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || gradeFilter !== 'all' || genderFilter !== 'all') && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                Search: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-2 hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
            {gradeFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                Grade {gradeFilter}
                <button 
                  onClick={() => setGradeFilter('all')}
                  className="ml-2 hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
            {genderFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                {genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1)}
                <button 
                  onClick={() => setGenderFilter('all')}
                  className="ml-2 hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-lg text-gray-700">
            Showing <span className="font-semibold text-green-600">{filteredStudents.length}</span> 
            {filteredStudents.length === 1 ? ' student' : ' students'}
            {searchTerm && ` for "${searchTerm}"`}
            {gradeFilter !== 'all' && ` in Grade ${gradeFilter}`}
            {genderFilter !== 'all' && ` (${genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1)})`}
          </p>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading students...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        <div className="text-sm text-gray-700">{student.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Grade {student.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          student.gender === 'male' || student.gender === 'Male' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {student.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate" title={student.address}>
                          {student.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                        <button 
                          onClick={() => handleEdit(student)} 
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded" 
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student._id || student.id)} 
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <Users size={48} className="text-gray-300 mb-2" />
                        <p className="text-lg">No students found</p>
                        <p className="text-sm mt-1">
                          {searchTerm || gradeFilter !== 'all' || genderFilter !== 'all' 
                            ? "Try adjusting your search criteria or filters"
                            : "No students available in the system"}
                        </p>
                        {(searchTerm || gradeFilter !== 'all' || genderFilter !== 'all') && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setGradeFilter('all');
                              setGenderFilter('all');
                            }}
                            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
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
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Student */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {isEditing ? 'Edit Student' : 'Add New Student'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={currentStudent.name} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={currentStudent.email} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input 
                  type="text" 
                  name="address" 
                  id="address" 
                  value={currentStudent.address} 
                  onChange={handleInputChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                    Grade *
                  </label>
                  <select 
                    name="grade" 
                    id="grade" 
                    value={currentStudent.grade} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select 
                    name="gender" 
                    id="gender" 
                    value={currentStudent.gender} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Phone
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    id="phone" 
                    value={currentStudent.phone} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input 
                    type="date" 
                    name="dateOfBirth" 
                    id="dateOfBirth" 
                    value={currentStudent.dateOfBirth} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Name
                  </label>
                  <input 
                    type="text" 
                    name="parentName" 
                    id="parentName" 
                    value={currentStudent.parentName} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div>
                  <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Phone
                  </label>
                  <input 
                    type="tel" 
                    name="parentPhone" 
                    id="parentPhone" 
                    value={currentStudent.parentPhone} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetFormAndCloseModal}
                  disabled={adminLoading}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
                >
                  {adminLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    isEditing ? 'Update Student' : 'Add Student'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;