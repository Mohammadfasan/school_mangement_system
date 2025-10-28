// src/pages/Admin/Sport.jsx
import React, { useState, useEffect } from 'react';
import { sportService } from '../../services/sportService';
import { useAuth } from '../../Context/AuthContext';
import { Edit, Trash2, Plus, Search, Filter, Award, Users, ClipboardList, Trophy, Calendar, MapPin, Clock, User } from 'lucide-react';

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

// --- Main Sport Component ---
const initialFormState = {
  id: null,
  title: '',
  type: '',
  category: 'outdoor',
  date: '',
  time: '',
  venue: '',
  participatingTeam: '',
  chiefGuest: '',
  status: 'upcoming',
  details: '',
  image: null,
  imagePreview: '',
  imageFile: null,
  colorCode: '#059669'
};

const Sport = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({});
  
  const [formState, setFormState] = useState(initialFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { user } = useAuth();
  
  const categories = ['outdoor', 'indoor', 'mixed', 'tournament', 'championship', 'league', 'competition', 'sports-meet'];
  const statusOptions = ['upcoming', 'live', 'completed', 'cancelled'];
  const sportTypes = ['Football', 'Basketball', 'Cricket', 'Volleyball', 'Tennis', 'Badminton', 'Athletics', 'Swimming', 'Other'];

  // Fetch data on component load
  useEffect(() => {
    fetchSports();
    fetchStatistics();
  }, []);

  // --- Data Fetching ---
  const fetchSports = async () => {
    try {
      setLoading(true);
      const response = await sportService.getAllSports();
      
      // Handle different response structures
      let sportsData = [];
      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          sportsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          sportsData = response.data;
        } else if (response.data.sports && Array.isArray(response.data.sports)) {
          sportsData = response.data.sports;
        }
      }
      
      console.log('🏆 Sports loaded:', sportsData.length);
      setSports(sportsData);
    } catch (error) {
      console.error('❌ Error fetching sports:', error);
      alert('Failed to fetch sports');
      setSports([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await sportService.getSportsStats();
      setStatistics(response.data.data || response.data || {});
    } catch (error) {
      console.error('❌ Error fetching sport statistics:', error);
      setStatistics({});
    }
  };
  
  // --- Form & Modal Handlers ---
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
        e.target.value = '';
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
      
      reader.onloadend = () => {
        setFormState(prevState => ({
          ...prevState,
          image: reader.result, // base64 string
          imagePreview: reader.result,
          imageFile: file,
        }));
      };
      
      reader.onerror = () => {
        console.error('Error reading image file');
        alert('Error reading image file. Please try again.');
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleAddNew = () => {
    setFormState(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (sport) => {
    console.log('✏️ Editing sport:', sport);
    
    // Format date for input
    const formattedDate = sport.date ? new Date(sport.date).toISOString().split('T')[0] : '';
    
    setFormState({
      id: sport._id || sport.id,
      title: sport.title || '',
      type: sport.type || '',
      category: sport.category || 'outdoor',
      date: formattedDate,
      time: sport.time || '',
      venue: sport.venue || '',
      participatingTeam: sport.participatingTeam || '',
      chiefGuest: sport.chiefGuest || '',
      status: sport.status || 'upcoming',
      details: sport.details || '',
      image: sport.image,
      imagePreview: sport.image,
      imageFile: null,
      colorCode: sport.colorCode || '#059669'
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
      console.log('🔍 [Sport.jsx] Submitting sport form...');
      console.log('📝 [Sport.jsx] Form state:', formState);

      // Prepare sport data according to Sport model schema
      const sportData = {
        title: formState.title,
        type: formState.type,
        category: formState.category,
        date: formState.date ? new Date(formState.date).toISOString() : new Date().toISOString(),
        time: formState.time,
        venue: formState.venue,
        participatingTeam: formState.participatingTeam,
        chiefGuest: formState.chiefGuest,
        status: formState.status,
        details: formState.details,
        image: formState.image, // base64 string
        colorCode: formState.colorCode
      };

      console.log('📤 [Sport.jsx] Sport data prepared:', sportData);

      let response;
      if (isEditing) {
        response = await sportService.updateSport(formState.id, sportData);
        alert('Sport updated successfully!');
      } else {
        response = await sportService.createSport(sportData);
        alert('Sport created successfully!');
      }
      
      console.log('✅ [Sport.jsx] Sport saved successfully:', response.data);
      resetFormAndCloseModal();
      fetchSports();
      fetchStatistics();
    } catch (error) {
      console.error('❌ [Sport.jsx] Error saving sport:', error);
      console.error('🔍 [Sport.jsx] Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        alert(`Failed to save sport: ${error.response.data.message}`);
      } else {
        alert('Failed to save sport: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sport?')) {
      try {
        await sportService.deleteSport(id);
        alert('Sport deleted successfully');
        fetchSports();
        fetchStatistics();
      } catch (error) {
        console.error('❌ Error deleting sport:', error);
        alert('Failed to delete sport: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // --- Filtering ---
  const filteredSports = sports.filter(sport => {
    const matchesSearch = sport.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sport.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sport.participatingTeam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sport.venue?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || sport.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || sport.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // --- Helper Functions ---
  const getCategoryColor = (category) => {
    const colors = {
      'outdoor': 'bg-green-100 text-green-800',
      'indoor': 'bg-blue-100 text-blue-800',
      'mixed': 'bg-purple-100 text-purple-800',
      'tournament': 'bg-yellow-100 text-yellow-800',
      'championship': 'bg-red-100 text-red-800',
      'league': 'bg-indigo-100 text-indigo-800',
      'competition': 'bg-pink-100 text-pink-800',
      'sports-meet': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'upcoming': 'bg-blue-100 text-blue-800',
      'live': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Helper to get stat value safely
  const getStat = (key) => {
    if (loading || !statistics) return '...';
    if (key === 'total') return statistics.totalEvents || sports.length;
    if (key === 'upcoming') return statistics.upcomingEvents || 0;
    if (key === 'completed') return statistics.completedEvents || 0;
    return 0;
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div>
      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<Trophy size={24} />} title="Total Sports" value={getStat('total')} />
        <StatCard icon={<ClipboardList size={24} />} title="Upcoming Events" value={getStat('upcoming')} />
        <StatCard icon={<Award size={24} />} title="Completed Events" value={getStat('completed')} />
      </div>

      {/* Main Content Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Manage Sports Events</h2>
          <button
            onClick={handleAddNew}
            className="flex items-center mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={18} className="mr-2" /> Add New Sport Event
          </button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, type, team, or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
          <div className="text-sm text-gray-600 flex items-center justify-end">
            Showing {filteredSports.length} of {sports.length} events
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
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
            {categoryFilter !== 'all' && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(categoryFilter)} border`}>
                {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                <button 
                  onClick={() => setCategoryFilter('all')}
                  className="ml-2 hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusFilter)} border`}>
                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <button 
                  onClick={() => setStatusFilter('all')}
                  className="ml-2 hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Sports Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading sports events...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue & Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category & Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSports.length > 0 ? (
                  filteredSports.map((sport) => (
                    <tr key={sport._id || sport.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sport.image ? (
                          <img 
                            src={sport.image} 
                            alt={sport.title} 
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
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{sport.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{sport.type}</p>
                          {sport.chiefGuest && (
                            <p className="text-xs text-yellow-600 mt-1">Chief Guest: {sport.chiefGuest}</p>
                          )}
                          {sport.details && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{sport.details}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDisplayDate(sport.date)}
                        </div>
                        {sport.time && (
                          <div className="text-sm text-gray-600">{sport.time}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{sport.venue}</div>
                        <div className="text-sm text-gray-600 mt-1">{sport.participatingTeam}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getCategoryColor(sport.category)}`}>
                            {sport.category}
                          </span>
                          <br />
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(sport.status)}`}>
                            {sport.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-3">
                        <button 
                          onClick={() => handleEdit(sport)} 
                          className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded-full hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(sport._id || sport.id)} 
                          className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-full hover:bg-red-50"
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
                        <Trophy size={48} className="text-gray-300 mb-2" />
                        <p className="text-lg">No sports events found</p>
                        <p className="text-sm mt-1">
                          {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                            ? "Try adjusting your search criteria or filters"
                            : "No sports events available in the system"}
                        </p>
                        {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setCategoryFilter('all');
                              setStatusFilter('all');
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

      {/* Modal for Add/Edit Sport */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {isEditing ? 'Edit Sport Event' : 'Add New Sport Event'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title *
                    </label>
                    <input 
                      type="text" 
                      name="title" 
                      id="title" 
                      value={formState.title} 
                      onChange={handleInputChange} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                      required 
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Sport Type *
                    </label>
                    <select 
                      name="type" 
                      id="type" 
                      value={formState.type} 
                      onChange={handleInputChange} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select Sport Type</option>
                      {sportTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select 
                      name="status" 
                      id="status" 
                      value={formState.status} 
                      onChange={handleInputChange} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date & Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Date & Location</h3>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date *
                    </label>
                    <input 
                      type="date" 
                      name="date" 
                      id="date" 
                      value={formState.date} 
                      onChange={handleInputChange} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                      required 
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Time *
                    </label>
                    <input 
                      type="time" 
                      name="time" 
                      id="time" 
                      value={formState.time} 
                      onChange={handleInputChange} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                      required 
                      placeholder="Enter venue name"
                    />
                  </div>

                  <div>
                    <label htmlFor="colorCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Color Code
                    </label>
                    <input 
                      type="color" 
                      name="colorCode" 
                      id="colorCode" 
                      value={formState.colorCode} 
                      onChange={handleInputChange} 
                      className="w-full h-12 p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                    />
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="participatingTeam" className="block text-sm font-medium text-gray-700 mb-1">
                    Participating Team *
                  </label>
                  <input 
                    type="text" 
                    name="participatingTeam" 
                    id="participatingTeam" 
                    value={formState.participatingTeam} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                    required 
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <label htmlFor="chiefGuest" className="block text-sm font-medium text-gray-700 mb-1">
                    Chief Guest (Optional)
                  </label>
                  <input 
                    type="text" 
                    name="chiefGuest" 
                    id="chiefGuest" 
                    value={formState.chiefGuest} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                    placeholder="Enter chief guest name"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Description
                </label>
                <textarea 
                  name="details" 
                  id="details" 
                  value={formState.details} 
                  onChange={handleInputChange} 
                  rows="4" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter event description..."
                ></textarea>
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Image
                </label>
                <div className="mt-1">
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
              </div>

              {formState.imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                  <div className="border border-gray-300 rounded-lg p-2">
                    <img 
                      src={formState.imagePreview} 
                      alt="Preview" 
                      className="w-full max-w-xs h-48 object-cover rounded-lg shadow-sm mx-auto" 
                    />
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Preview - Image will be saved as base64
                    </p>
                  </div>
                </div>
              )}

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
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditing ? 'Update Sport Event' : 'Create Sport Event'
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

export default Sport;