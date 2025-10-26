import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { Edit, Trash2, Plus } from 'lucide-react';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch students from backend
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAllStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentStudent({ name: '', address: '', grade: 'Grade 1', gender: 'Male' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm(`Are you sure you want to delete this student?`)) {
      try {
        await studentService.deleteStudent(studentId);
        alert('Student deleted successfully!');
        fetchStudents(); // Refresh the list
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentStudent.name || !currentStudent.address) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      if (isEditing) {
        await studentService.updateStudent(currentStudent.id, currentStudent);
        alert('Student updated successfully!');
      } else {
        await studentService.createStudent(currentStudent);
        alert('New student added successfully!');
      }

      setIsModalOpen(false);
      setCurrentStudent(null);
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Student Management</h1>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Student
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {students.map((student, index) => (
          <div key={student.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-md font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.grade}</p>
                <p className="text-sm text-gray-500 mt-1">{student.address}</p>
              </div>
              <span className="flex-shrink-0 text-sm font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                {student.gender}
              </span>
            </div>
            <div className="flex justify-end space-x-3 pt-3 mt-3 border-t border-gray-100">
              <button onClick={() => handleEdit(student)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-900" title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, index) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-4">
                  <button onClick={() => handleEdit(student)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-900" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-lg mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {isEditing ? 'Edit Student' : 'Add New Student'}
            </h2>
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={currentStudent.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isEditing}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={currentStudent.address}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                  <select
                    name="grade"
                    id="grade"
                    value={currentStudent.grade}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>Grade 1</option>
                    <option>Grade 2</option>
                    <option>Grade 3</option>
                    <option>Grade 4</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    id="gender"
                    value={currentStudent.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-2 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save
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