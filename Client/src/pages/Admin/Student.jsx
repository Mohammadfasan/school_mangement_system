import React, { useState } from 'react';
import { studentsData } from '../../assets/images/assert.js';
import { Edit, Trash2, Plus } from 'lucide-react';

const Student = () => {
  // --- Load students from localStorage or fallback to default ---
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : studentsData.students;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- Add new student ---
  const handleAdd = () => {
    setCurrentStudent({ name: '', address: '', grade: 'Grade 1', gender: 'Male' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // --- Edit existing student ---
  const handleEdit = (student) => {
    setCurrentStudent(student);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (studentNameToDelete) => {
    if (window.confirm(`Are you sure you want to delete ${studentNameToDelete}?`)) {
      const updatedStudents = students.filter(student => student.name !== studentNameToDelete);
      setStudents(updatedStudents);
      localStorage.setItem('students', JSON.stringify(updatedStudents)); // ✅ Save to localStorage
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentStudent.name || !currentStudent.address) {
      alert('Please fill in all fields.');
      return;
    }

    let updatedStudents;
    if (isEditing) {
      updatedStudents = students.map(s => (s.name === currentStudent.name ? currentStudent : s));
    } else {
      updatedStudents = [...students, currentStudent];
    }

    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents)); // ✅ Save to localStorage

    setIsModalOpen(false);
    setCurrentStudent(null);
  };

  // --- Handle form input changes ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

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

      {/* --- Mobile Card View --- */}
      <div className="space-y-4 md:hidden">
        {students.map((student, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
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
              <button onClick={() => handleDelete(student.name)} className="text-red-600 hover:text-red-900" title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

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
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-4">
                  <button onClick={() => handleEdit(student)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(student.name)} className="text-red-600 hover:text-red-900" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentStudent && (
        <div className="fixed inset-0  flex items-center justify-center p-4">
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
