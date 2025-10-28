// src/pages/Admin/Achievement.jsx
import React, { useState, useEffect } from 'react';
import { achievementService } from '../../services/achievementService';
import { Edit, Trash2, Plus, Award, Users, ClipboardList, Trophy } from 'lucide-react';

// --- Helper Components ---

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

// --- Main Achievement Component ---

const initialFormState = {
  id: null,
  title: '',
  student: '',
  grade: '',
  award: '',
  category: 'Sport',
  date: '',
  venue: '',
  description: '',
  image: null,
  imagePreview: '',
  highlight: false
};

const Achievement = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({});
  
  const [formState, setFormState] = useState(initialFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  // Fetch data on component load
  useEffect(() => {
    fetchAchievements();
    fetchStatistics();
  }, []);

  // --- Data Fetching ---

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementService.getAllAchievements();
      // Handle different response structures
      const data = response.data?.data || response.data || [];
      if (Array.isArray(data)) {
        setAchievements(data);
      } else {
        console.error("API did not return an array of achievements", data);
        setAchievements([]);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      alert('Failed to fetch achievements');
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await achievementService.getAchievementStats();
      setStatistics(response.data?.data || response.data || {});
    } catch (error) {
      console.error('Error fetching achievement statistics:', error);
      setStatistics({});
    }
  };
  
  // --- Form & Modal Handlers ---

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prevState => ({ 
      ...prevState, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormState(prevState => ({
        ...prevState,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleAddNew = () => {
    setFormState(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (achievement) => {
    // Format date for the <input type="date"> field
    const formattedDate = achievement.date ? new Date(achievement.date).toISOString().split('T')[0] : '';
    
    setFormState({
      ...achievement,
      id: achievement._id || achievement.id,
      date: formattedDate,
      image: null, // Clear file object
      imagePreview: achievement.image || '', // Show existing image as preview
      highlight: achievement.highlight || false
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };
  
  const resetFormAndCloseModal = () => {
    setFormState(initialFormState);
    setIsEditing(false);
    setIsModalOpen(false);
    setAdminLoading(false);
  };

  // --- Backend Actions (Submit/Delete) ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdminLoading(true);

    try {
      const formData = new FormData();
      
      formData.append('title', formState.title);
      formData.append('student', formState.student);
      formData.append('grade', formState.grade || 'N/A');
      formData.append('award', formState.award);
      formData.append('category', formState.category);
      formData.append('date', formState.date);
      formData.append('venue', formState.venue || 'N/A');
      formData.append('description', formState.description || '');
      formData.append('highlight', formState.highlight.toString());
      
      if (formState.image instanceof File) {
        formData.append('image', formState.image);
      }

      let response;
      if (isEditing) {
        response = await achievementService.updateAchievement(formState.id, formData);
      } else {
        response = await achievementService.createAchievement(formData);
      }

      alert(`Achievement ${isEditing ? 'updated' : 'created'} successfully!`);
      resetFormAndCloseModal();
      fetchAchievements();
      fetchStatistics();
      
    } catch (error) {
      console.error('Error saving achievement:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unknown error occurred';
      alert(`Failed to save achievement: ${errorMessage}`);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await achievementService.deleteAchievement(id);
        alert('Achievement deleted successfully');
        fetchAchievements();
        fetchStatistics();
      } catch (error) {
        console.error('Error deleting achievement:', error);
        alert('Failed to delete achievement');
      }
    }
  };
  
  // Helper to get stat value safely
  const getStat = (key) => {
    if (loading || !statistics) return '...';
    if (key === 'total') return statistics.total || achievements.length;
    if (key === 'highlighted') return statistics.highlighted || 0;
    return 0;
  };

  const getCategoryBadge = (category) => {
    switch (category?.toLowerCase()) {
      case 'sport':
        return 'bg-blue-100 text-blue-800';
      case 'academic':
        return 'bg-green-100 text-green-800';
      case 'cultural':
        return 'bg-purple-100 text-purple-800';
      case 'leadership':
        return 'bg-yellow-100 text-yellow-800';
      case 'art':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<Trophy size={24} />} title="Total Achievements" value={getStat('total')} />
        <StatCard icon={<Award size={24} />} title="Highlighted" value={getStat('highlighted')} />
        <StatCard icon={<Users size={24} />} title="Categories" value="6" />
      </div>

      {/* Main Content Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Manage Achievements</h2>
          <button
            onClick={handleAddNew}
            className="flex items-center mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={18} className="mr-2" /> Add New Achievement
          </button>
        </div>

        {/* Achievements Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading achievements...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Award</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {achievements.length > 0 ? (
                  achievements.map((ach) => (
                    <tr key={ach._id || ach.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img 
                          src={ach.image || '/uploads/achievements/default-achievement.jpg'} 
                          alt={ach.title} 
                          className="w-20 h-16 object-cover rounded-md shadow-sm" 
                          onError={(e) => {
                            e.target.src = '/uploads/achievements/default-achievement.jpg';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {ach.title}
                          {ach.highlight && (
                            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ach.student}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ach.award}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full font-semibold text-xs capitalize ${getCategoryBadge(ach.category)}`}>
                          {ach.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(ach.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                        <button 
                          onClick={() => handleEdit(ach)} 
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(ach._id || ach.id)} 
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      <ClipboardList size={48} className="mx-auto mb-2 text-gray-400" />
                      <p>No achievements found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Achievement */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {isEditing ? 'Edit Achievement' : 'Add New Achievement'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Achievement Title *
                </label>
                <input 
                  type="text" 
                  name="title" 
                  id="title" 
                  value={formState.title} 
                  onChange={handleInputChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                  required 
                  placeholder="Enter achievement title"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name *
                  </label>
                  <input 
                    type="text" 
                    name="student" 
                    id="student" 
                    value={formState.student} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    required 
                    placeholder="Student name"
                  />
                </div>
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                    Grade *
                  </label>
                  <input 
                    type="text" 
                    name="grade" 
                    id="grade" 
                    value={formState.grade} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    required 
                    placeholder="e.g., Grade 10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="award" className="block text-sm font-medium text-gray-700 mb-1">
                    Award *
                  </label>
                  <input 
                    type="text" 
                    name="award" 
                    id="award" 
                    value={formState.award} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    required 
                    placeholder="e.g., 1st Place, Gold Medal"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select 
                    name="category" 
                    id="category" 
                    value={formState.category} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Sport">Sport</option>
                    <option value="Academic">Academic</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Art">Art</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date Achieved *
                  </label>
                  <input 
                    type="date" 
                    name="date" 
                    id="date" 
                    value={formState.date} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                    Venue *
                  </label>
                  <input 
                    type="text" 
                    name="venue" 
                    id="venue" 
                    value={formState.venue} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    required 
                    placeholder="Event location"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  name="description" 
                  id="description" 
                  value={formState.description} 
                  onChange={handleInputChange} 
                  rows="3" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Additional details about the achievement..."
                ></textarea>
              </div>

              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  name="highlight" 
                  id="highlight" 
                  checked={formState.highlight} 
                  onChange={handleInputChange} 
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="highlight" className="ml-2 block text-sm text-gray-700">
                  Feature this achievement (highlight)
                </label>
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Achievement Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {formState.imagePreview && (
                    <img 
                      src={formState.imagePreview} 
                      alt="Preview" 
                      className="w-24 h-20 object-cover rounded-md shadow-sm border" 
                    />
                  )}
                  <div className="flex-1">
                    <input 
                      type="file" 
                      name="image" 
                      id="image" 
                      onChange={handleImageChange} 
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
                      accept="image/*"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPEG, JPG, PNG, GIF, WebP (Max: 10MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0 mt-6 pt-4 border-t border-gray-200">
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
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditing ? 'Update Achievement' : 'Create Achievement'
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

export default Achievement;