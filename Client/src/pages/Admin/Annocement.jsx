// src/pages/Admin/Annocement.jsx

import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

// Initial data for demonstration.
const initialAnnouncements = [
  { id: 1, title: 'School Canceled Today', description: 'Due to severe weather conditions, the school will be closed today, October 16, 2025.' },
  { id: 2, title: 'Sports Meet Practice', description: 'Practice for the annual sports meet will be held at 3:00 PM on the school grounds.' },
  { id: 3, title: 'Parent-Teacher Meeting', description: 'The quarterly Parent-Teacher meeting is scheduled for next Friday. Please check the school portal for your time slot.' },
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  
  const [formState, setFormState] = useState({
    id: null,
    title: '',
    description: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormState({ id: null, title: '', description: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.title || !formState.description) {
      alert('Please fill in both title and description.');
      return;
    }

    if (isEditing) {
      setAnnouncements(
        announcements.map(ann =>
          ann.id === formState.id ? { ...ann, ...formState } : ann
        )
      );
      alert('Announcement updated successfully!');
    } else {
      const newAnnouncement = {
        ...formState,
        id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
      };
      setAnnouncements([...announcements, newAnnouncement]);
      alert('New announcement added successfully!');
    }
    
    resetForm();
  };

  const handleEdit = (announcement) => {
    window.scrollTo(0, 0); 
    setIsEditing(true);
    setFormState(announcement);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(ann => ann.id !== id));
      alert('Announcement deleted successfully!');
      if (isEditing && formState.id === id) {
        resetForm();
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Announcement Management</h1>

      {/* Form for Adding/Editing Announcements */}
      {/* CHANGED: Added p-4 for smaller screens, sm:p-6 for larger */}
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
          
          {/* CHANGED: This container now stacks buttons on mobile (flex-col) and puts them side-by-side on sm screens and up (sm:flex-row) */}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                // CHANGED: Added w-full sm:w-auto for full-width on mobile
                className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              // CHANGED: Added w-full sm:w-auto for full-width on mobile
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
        
        {/* === START: NEW MOBILE CARD VIEW === */}
        {/* This div is visible by default and hidden on 'md' screens and up */}
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
        {/* === END: NEW MOBILE CARD VIEW === */}


        {/* === START: ORIGINAL TABLE VIEW (Now for Desktop) === */}
        {/* CHANGED: Added 'hidden md:block' to hide this table on mobile and show it on medium screens and up */}
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
                            {/* CHANGED: Added whitespace-normal to allow description to wrap, and max-w-md to limit width */}
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
        
      </div>
    </div>
  );
};

export default Announcements;