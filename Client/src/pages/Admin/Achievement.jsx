// src/pages/Admin/Achievement.jsx

import React, { useState, useEffect } from 'react';
import { achievementService } from '../../services/achievementService'
import { Edit, Trash2 } from 'lucide-react';

const Achievement = () => {
  const [achievementsData, setAchievementsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    id: null,
    title: '',
    student: '',
    award: '',
    category: 'Sport',
    date: '',
    venue: '',
    description: '',
    image: null,
    imagePreview: '', 
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch achievements from backend
  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementService.getAllAchievements();
      setAchievementsData(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      alert('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setFormState(prevState => ({
        ...prevState,
        image: file,
        imagePreview: previewUrl,
      }));
    }
  };

  const resetForm = () => {
    if (formState.imagePreview && formState.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(formState.imagePreview);
    }
    setIsEditing(false);
    setFormState({
      id: null,
      title: '',
      student: '',
      award: '',
      category: 'Sport',
      date: '',
      venue: '',
      description: '',
      image: null,
      imagePreview: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('title', formState.title);
      formData.append('student', formState.student);
      formData.append('award', formState.award);
      formData.append('category', formState.category);
      formData.append('date', formState.date);
      formData.append('venue', formState.venue);
      formData.append('description', formState.description);
      if (formState.image) {
        formData.append('image', formState.image);
      }

      if (isEditing) {
        await achievementService.updateAchievement(formState.id, formData);
        alert('Achievement updated successfully!');
      } else {
        await achievementService.createAchievement(formData);
        alert('New achievement added successfully!');
      }
      
      resetForm();
      fetchAchievements(); // Refresh the list
    } catch (error) {
      console.error('Error saving achievement:', error);
      alert('Failed to save achievement');
    }
  };

  const handleEdit = (achievement) => {
    window.scrollTo(0, 0);
    setIsEditing(true);
    setFormState({
      ...achievement,
      imagePreview: achievement.image,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await achievementService.deleteAchievement(id);
        alert('Achievement deleted successfully!');
        fetchAchievements(); // Refresh the list
        if (isEditing && formState.id === id) {
          resetForm();
        }
      } catch (error) {
        console.error('Error deleting achievement:', error);
        alert('Failed to delete achievement');
      }
    }
  };
  
  const getCategoryBadge = (category) => {
    switch (category.toLowerCase()) {
      case 'sport':
        return 'bg-blue-100 text-blue-800';
      case 'academic':
        return 'bg-green-100 text-green-800';
      case 'art':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Achievement Management</h1>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {isEditing ? 'Edit Achievement' : 'Add New Achievement'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" name="title" id="title" value={formState.title} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm" required />
            </div>
            <div>
              <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
              <input type="text" name="student" id="student" value={formState.student} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm" required />
            </div>
            <div>
              <label htmlFor="award" className="block text-sm font-medium text-gray-700 mb-1">Award</label>
              <input type="text" name="award" id="award" value={formState.award} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm" placeholder="e.g., 1st Place" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" id="category" value={formState.category} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                <option>Sport</option>
                <option>Academic</option>
                <option>Art</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="date" id="date" value={formState.date} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input type="text" name="venue" id="venue" value={formState.venue} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" id="description" rows="3" value={formState.description} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm"></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input type="file" name="image" id="image" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            </div>
            {formState.imagePreview && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                <img src={formState.imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm} 
                className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Achievement List</h2>
        
        <div className="space-y-4 md:hidden">
          {achievementsData.map(ach => (
            <div key={ach.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={ach.image} alt={ach.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{ach.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{ach.student}</p>
                <span className={`px-3 py-1 rounded-full font-semibold text-xs capitalize ${getCategoryBadge(ach.category)}`}>
                  {ach.category}
                </span>
                <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-100">
                  <button onClick={() => handleEdit(ach)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(ach.id)} className="text-red-600 hover:text-red-900" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {achievementsData.map(ach => (
                <tr key={ach.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <img src={ach.image} alt={ach.title} className="w-20 h-16 object-cover rounded-md shadow-sm" />
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ach.title}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ach.student}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 rounded-full font-semibold text-xs capitalize ${getCategoryBadge(ach.category)}`}>
                      {ach.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-4">
                    <button onClick={() => handleEdit(ach)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(ach.id)} className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Achievement;