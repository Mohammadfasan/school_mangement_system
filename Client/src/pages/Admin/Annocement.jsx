// src/pages/Admin/Annocement.jsx

import React, { useState, useEffect } from 'react';
import { announcementService } from '../../services/announcementService';
import { Edit, Trash2 } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    id: null,
    title: '',
    description: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch announcements from backend
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await announcementService.getAllAnnouncements();
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      alert('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormState({ id: null, title: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.title || !formState.description) {
      alert('Please fill in both title and description.');
      return;
    }

    try {
      if (isEditing) {
        await announcementService.updateAnnouncement(formState.id, formState);
        alert('Announcement updated successfully!');
      } else {
        await announcementService.createAnnouncement(formState);
        alert('New announcement added successfully!');
      }
      
      resetForm();
      fetchAnnouncements(); // Refresh the list
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    }
  };

  const handleEdit = (announcement) => {
    window.scrollTo(0, 0); 
    setIsEditing(true);
    setFormState(announcement);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementService.deleteAnnouncement(id);
        alert('Announcement deleted successfully!');
        fetchAnnouncements(); // Refresh the list
        if (isEditing && formState.id === id) {
          resetForm();
        }
      } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Failed to delete announcement');
      }
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Announcement Management</h1>

      {/* Form for Adding/Editing Announcements */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {isEditing ? 'Edit Announcement' : 'Add New Announcement'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={formState.title}
                onChange={handleInputChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., School Canceled"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                id="description"
                rows="4"
                value={formState.description}
                onChange={handleInputChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Full details of the announcement..."
                required
              ></textarea>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* List of Current Announcements */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Announcements</h2>
        
        {announcements.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No announcements found.</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="space-y-4 md:hidden">
              {announcements.map(ann => (
                <div key={ann.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-md font-semibold text-gray-900">{ann.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 mb-3">{ann.description}</p>
                  <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                    <button onClick={() => handleEdit(ann)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(ann.id)} className="text-red-600 hover:text-red-900" title="Delete">
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
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {announcements.map(ann => (
                    <tr key={ann.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ann.title}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 whitespace-normal max-w-md">{ann.description}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-4">
                        <button onClick={() => handleEdit(ann)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(ann.id)} className="text-red-600 hover:text-red-900" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Announcements;