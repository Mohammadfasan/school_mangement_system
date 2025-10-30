// src/pages/Admin/Event.jsx
import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { Edit, Trash2 } from 'lucide-react';

const Event = () => {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [formState, setFormState] = useState({
    id: null,
    title: '',
    student: '',
    award: '',
    category: 'Sport',
    date: '',
    venue: '',
    description: '',
    status: 'upcoming',
    time: '',
    image: null,
    imagePreview: '',
    imageFile: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();
      setEventsData(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events');
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
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB. Please choose a smaller image.');
        e.target.value = ''; // Clear the file input
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP).');
        e.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        console.log('Starting to read image file...');
      };
      
      reader.onloadend = () => {
        console.log('Image file read completed, size:', reader.result.length, 'bytes');
        setFormState(prevState => ({
          ...prevState,
          image: reader.result, // base64 string for preview
          imagePreview: reader.result,
          imageFile: file, // The actual File object
        }));
      };
      
      reader.onerror = () => {
        console.error('Error reading image file');
        alert('Error reading image file. Please try again.');
      };
      
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
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
      status: 'upcoming',
      time: '',
      image: null,
      imagePreview: '',
      imageFile: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      console.log('Submitting event form...');
      
      // --- START: FIX ---
      // Create FormData to send files and text fields together
      const formData = new FormData();
      
      // Append all the text fields
      formData.append('title', formState.title);
      formData.append('student', formState.student);
      formData.append('award', formState.award);
      formData.append('category', formState.category);
      formData.append('date', formState.date);
      formData.append('venue', formState.venue);
      formData.append('description', formState.description);
      formData.append('status', formState.status);
      formData.append('time', formState.time);

      // Append the actual file object, not the base64 string
      // The backend (e.g., multer) will handle this file
      if (formState.imageFile) {
        formData.append('image', formState.imageFile);
      }
      // --- END: FIX ---

      console.log('Event data prepared as FormData...');

      let response;
      if (isEditing) {
        // Pass the new 'formData' object
        response = await eventService.updateEvent(formState.id, formData);
        alert('Event updated successfully!');
      } else {
        // Pass the new 'formData' object
        response = await eventService.createEvent(formData);
        alert('New event added successfully!');
      }
      
      console.log('Event saved successfully:', response.data);
      resetForm();
      fetchEvents(); // Refresh the list
    } catch (error) {
      console.error('Error saving event:', error);
      if (error.response?.status === 413) {
        alert('Image file is too large even after compression. Please choose a smaller image (under 2MB).');
      } else {
        alert('Failed to save event: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (event) => {
    window.scrollTo(0, 0);
    setIsEditing(true);
    setFormState({
      id: event._id || event.id,
      title: event.title,
      student: event.student,
      award: event.award,
      category: event.category,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      venue: event.venue,
      description: event.description,
      status: event.status,
      time: event.time,
      image: event.image, // This is the existing image URL/path
      imagePreview: event.image, // Show existing image
      imageFile: null, // No new file selected yet
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id);
        alert('Event deleted successfully!');
        fetchEvents(); // Refresh the list
        if (isEditing && formState.id === id) {
          resetForm();
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event: ' + (error.response?.data?.message || error.message));
      }
    }
  };
  
  const getCategoryBadge = (category) => {
    switch (category?.toLowerCase()) {
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

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Event Management</h1>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {isEditing ? 'Edit Event' : 'Add New Event'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input 
                type="text" 
                name="title" 
                id="title" 
                value={formState.title} 
                onChange={handleInputChange} 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
              <input 
                type="text" 
                name="student" 
                id="student" 
                value={formState.student} 
                onChange={handleInputChange} 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label htmlFor="award" className="block text-sm font-medium text-gray-700 mb-1">Award *</label>
              <input 
                type="text" 
                name="award" 
                id="award" 
                value={formState.award} 
                onChange={handleInputChange} 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="e.g., 1st Place" 
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select 
                name="category" 
                id="category" 
                value={formState.category} 
                onChange={handleInputChange} 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Sport">Sport</option>
                <option value="Academic">Academic</option>
                <option value="Art">Art</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input 
                type="date" 
                name="date" 
                id="date" 
                value={formState.date} 
                onChange={handleInputChange} 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input 
                type="time" 
                name="time" 
                id="time" 
                value={formState.time} 
                onChange={handleInputChange} 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
              <input 
                type="text" 
                name="venue" 
                id="venue" 
                value={formState.venue} 
                onChange={handleInputChange} 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                required
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select 
                name="status" 
                id="status" 
                value={formState.status} 
                onChange={handleInputChange} 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description" 
                id="description" 
                rows="3" 
                value={formState.description} 
                onChange={handleInputChange} 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter event description..."
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
              <input 
                type="file" 
                name="image" 
                id="image" 
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange} 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
              />
              <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB</p>
              {formState.imageFile && (
                <p className="text-xs text-green-600 mt-1">
                  Selected: {formState.imageFile.name} ({(formState.imageFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            {formState.imagePreview && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                <div className="border border-gray-300 rounded-lg p-2">
                  <img 
                    src={formState.imagePreview} 
                    alt="Preview" 
                    className="w-full max-w-xs h-48 object-cover rounded-lg shadow-sm mx-auto" 
                  />
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Preview - Image will be compressed automatically
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm} 
                disabled={submitLoading}
                className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 font-medium disabled:opacity-50"
              >
                Cancel Edit
              </button>
            )}
            <button 
              type="submit" 
              disabled={submitLoading}
              className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium disabled:opacity-50 flex items-center justify-center"
            >
              {submitLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Event' : 'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Events List Table - Same as before */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Event List</h2>
          <div className="text-sm text-gray-600">
            Total: {eventsData.length} events
          </div>
        </div>
        
        {/* Mobile View */}
        <div className="space-y-4 md:hidden">
          {eventsData.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">No events found. Create your first event!</p>
            </div>
          ) : (
            eventsData.map(event => (
              <div key={event._id || event.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                {event.image && (
                  <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{event.student}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getCategoryBadge(event.category)}`}>
                      {event.category}
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      {event.award}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{event.description}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                    {event.time && <p>Time: {event.time}</p>}
                    <p>Venue: {event.venue}</p>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-100">
                    <button 
                      onClick={() => handleEdit(event)} 
                      className="flex items-center text-indigo-600 hover:text-indigo-900 transition duration-200"
                      title="Edit"
                    >
                      <Edit size={18} className="mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id || event.id)} 
                      className="flex items-center text-red-600 hover:text-red-900 transition duration-200"
                      title="Delete"
                    >
                      <Trash2 size={18} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Desktop View */}
        <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
          {eventsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events found. Create your first event above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category & Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Venue</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eventsData.map(event => (
                    <tr key={event._id || event.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.image ? (
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-20 h-16 object-cover rounded-md shadow-sm" 
                          />
                        ) : (
                          <div className="w-20 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                            <span className="text-xs text-gray-400">No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{event.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.student}</p>
                          <p className="text-sm text-yellow-700 font-medium mt-1">{event.award}</p>
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{event.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getCategoryBadge(event.category)}`}>
                            {event.category}
                          </span>
                          <br />
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        {event.time && (
                          <div className="text-sm text-gray-600">{event.time}</div>
                        )}
                        <div className="text-sm text-gray-600 mt-1">{event.venue}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-center space-x-3">
                          <button 
                            onClick={() => handleEdit(event)} 
                            className="text-indigo-600 hover:text-indigo-900 transition duration-200 p-2 rounded-full hover:bg-indigo-50"
                            title="Edit Event"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(event._id || event.id)} 
                            className="text-red-600 hover:text-red-900 transition duration-200 p-2 rounded-full hover:bg-red-50"
                            title="Delete Event"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event;