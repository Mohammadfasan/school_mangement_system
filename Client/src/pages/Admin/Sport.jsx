// src/pages/Admin/Sport.jsx

import React, { useState } from 'react';
import { sportsCardsData as initialData } from '../../assets/images/assert.js'; // Import static data
import { Edit, Trash2 } from 'lucide-react'; // Icons for action buttons

// --- Helper function to get initial data ---
// Reads from localStorage or uses initial data and saves it.
const getInitialSportsData = () => {
  const savedSports = localStorage.getItem('sports');
  if (savedSports) {
    return JSON.parse(savedSports);
  } else {
    // If nothing in localStorage, use initialData and save it
    localStorage.setItem('sports', JSON.stringify(initialData));
    return initialData;
  }
};

const Sport = () => {
  // State to hold the list of all sports events
  // MODIFIED: Now uses the helper function to load from localStorage
  const [sportsData, setSportsData] = useState(getInitialSportsData);
  
  // State to manage the form inputs for adding or editing an event
  const [formState, setFormState] = useState({
    id: null,
    title: '',
    type: '',
    date: '',
    time: '',
    venue: '',
    participatingTeam: '',
    status: 'upcoming',
    details: '',
    image: null,        // To hold the raw file object
    imagePreview: '',   // To hold the URL for the preview
  });

  // State to track if the form is in 'edit' mode or 'add' mode
  const [isEditing, setIsEditing] = useState(false);

  // Update form state as the user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };
  
  // Handle the image file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a temporary URL for the selected image to show a preview
      const previewUrl = URL.createObjectURL(file);
      setFormState(prevState => ({
        ...prevState,
        image: file,        // The actual file
        imagePreview: previewUrl, // The preview URL
      }));
    }
  };

  // Reset the form to its initial empty state
  const resetForm = () => {
    // Revoke the object URL to prevent memory leaks
    if (formState.imagePreview && formState.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(formState.imagePreview);
    }
    setIsEditing(false);
    setFormState({
      id: null,
      title: '',
      type: '',
      date: '',
      time: '',
      venue: '',
      participatingTeam: '',
      status: 'upcoming',
      details: '',
      image: null,
      imagePreview: '',
    });
  };

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // If editing, find the existing event and update it
      const updatedSport = {
        ...formState,
        // If a new image was uploaded (imagePreview is a blob), use it.
        // Otherwise, keep the original image from sportsData.
        image: formState.imagePreview,
      };

      // MODIFIED: Create new array and save to localStorage
      const updatedData = sportsData.map(sport => sport.id === formState.id ? updatedSport : sport );
      setSportsData(updatedData);
      localStorage.setItem('sports', JSON.stringify(updatedData)); // <-- SAVE TO LOCALSTORAGE
      
      alert('Sport event updated successfully!');
    } else {
      // If not editing, create a new event
      const newSport = {
        ...formState,
        id: sportsData.length > 0 ? Math.max(...sportsData.map(s => s.id)) + 1 : 1,
        // Use the preview URL for the image property
        image: formState.imagePreview || 'https://via.placeholder.com/400x300.png?text=Sport+Event',
      };

      // MODIFIED: Create new array and save to localStorage
      const updatedData = [...sportsData, newSport];
      setSportsData(updatedData);
      localStorage.setItem('sports', JSON.stringify(updatedData)); // <-- SAVE TO LOCALSTORAGE

      alert('New sport event added successfully!');
    }
    
    resetForm();
  };

  // Set the form state when the 'Edit' button is clicked
  const handleEdit = (sport) => {
    window.scrollTo(0, 0); // Scroll to top to see the form
    setIsEditing(true);
    // Set the form state to the data of the sport being edited
    setFormState({
      ...sport,
      imagePreview: sport.image, // Set the preview to the existing image URL
      image: null,               // Clear the file input
    });
  };

  // Delete a sport event after confirmation
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sport event?')) {
      
      // MODIFIED: Create new array and save to localStorage
      const updatedData = sportsData.filter(sport => sport.id !== id);
      setSportsData(updatedData);
      localStorage.setItem('sports', JSON.stringify(updatedData)); // <-- SAVE TO LOCALSTORAGE

      alert('Sport event deleted successfully!');
      // If the deleted item was being edited, reset the form
      if (isEditing && formState.id === id) {
        resetForm();
      }
    }
  };

  // Helper function to get badge colors based on status
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'live':
        return 'bg-red-100 text-red-800 animate-pulse';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Sports Management</h1>

     
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {isEditing ? 'Edit Sport Event' : 'Add New Sport Event'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Responsive grid: 1 col on mobile, 2 on desktop (already responsive) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input type="text" name="title" id="title" value={formState.title} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm" required />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Sport Type</label>
              <input type="text" name="type" id="type" value={formState.type} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm" placeholder="e.g., Basketball, Track" />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="date" id="date" value={formState.date} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" name="time" id="time" value={formState.time} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input type="text" name="venue" id="venue" value={formState.venue} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" id="status" value={formState.status} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="participatingTeam" className="block text-sm font-medium text-gray-700 mb-1">Participating Teams</label>
              <input type="text" name="participatingTeam" id="participatingTeam" value={formState.participatingTeam} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Event Details</label>
              <textarea name="details" id="details" rows="3" value={formState.details} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm"></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
              <input type="file" name="image" id="image" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            </div>
            {/* Image preview section */}
            {formState.imagePreview && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                <img src={formState.imagePreview} alt="Event Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
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
              {isEditing ? 'Update Event' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Sports Events</h2>

        
        <div className="space-y-4 md:hidden">
          {sportsData.map(sport => (
            <div key={sport.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={sport.image} alt={sport.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 pr-2">{sport.title}</h3>
                  <span className={`flex-shrink-0 px-3 py-1 rounded-full font-semibold text-xs capitalize ${getStatusBadge(sport.status)}`}>
                      {sport.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{sport.venue}</p>
                <p className="text-sm text-gray-500">{sport.type}</p>
                
                <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-100">
                  <button onClick={() => handleEdit(sport)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(sport.id)} className="text-red-600 hover:text-red-900" title="Delete">
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
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sportsData.map(sport => (
                        <tr key={sport.id} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-4">
                                <img src={sport.image} alt={sport.title} className="w-20 h-16 object-cover rounded-md shadow-sm" />
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sport.title}</td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sport.venue}</td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-3 py-1 rounded-full font-semibold text-xs capitalize ${getStatusBadge(sport.status)}`}>
                                    {sport.status}
                                </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-4">
                                <button onClick={() => handleEdit(sport)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                                  <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(sport.id)} className="text-red-600 hover:text-red-900" title="Delete">
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

export default Sport;