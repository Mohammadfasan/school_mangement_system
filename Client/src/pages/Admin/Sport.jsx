// src/pages/Admin/Sport.jsx
import React, { useState, useEffect } from 'react';
import { sportService } from '../../services/sportService';
import { useAuth } from '../../Context/AuthContext';
import { Edit, Trash2, Plus, Search, Filter, Trophy, Calendar, ClipboardList, Users, ChevronLeft, ChevronRight, Award } from 'lucide-react';

// Helper Components (same as before)
const StatCard = ({ icon, title, value, loading }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
    <div className="p-3 rounded-full bg-green-100 text-green-600">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {loading ? (
        <div className="animate-pulse bg-gray-200 h-6 w-12 rounded mt-1"></div>
      ) : (
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      )}
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
    ))}
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft size={16} className="mr-1" />
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
      >
        Next
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
};

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
  colorCode: '#059669',
  image: null,
  imagePreview: '',
  imageFile: null,
  imageFileId: null,
};

const Sport = () => {
  const [sportsData, setSportsData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { user } = useAuth();

  useEffect(() => {
    fetchSports();
  }, [currentPage, searchTerm, filterStatus]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchSports = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus })
      };
      
      const response = await sportService.getAllSports(params);
      
      setSportsData(response.data.data || []);
      setTotalPages(response.data.pages || 1);
      setCurrentPage(response.data.page || 1);
      setTotalItems(response.data.total || 0);
      
    } catch (error) {
      console.error('Error fetching sports:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch sports';
      alert(`Error fetching sports: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStats = async () => {
    setAdminLoading(true);
    try {
      const response = await sportService.getSportsStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB.');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormState(prevState => ({
          ...prevState,
          imagePreview: reader.result,
          imageFile: file,
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (sport) => {
    setFormState({
      id: sport._id || sport.id,
      title: sport.title,
      type: sport.type,
      category: sport.category,
      date: sport.date ? new Date(sport.date).toISOString().split('T')[0] : '',
      time: sport.time,
      venue: sport.venue,
      participatingTeam: sport.participatingTeam,
      chiefGuest: sport.chiefGuest || '',
      status: sport.status,
      details: sport.details || '',
      colorCode: sport.colorCode || '#059669',
      image: sport.image,
      imagePreview: sport.image,
      imageFile: null,
      imageFileId: sport.imageFileId || null,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetFormAndCloseModal = () => {
    setFormState(initialFormState);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdminLoading(true);

    try {
      const formData = new FormData();
      
      formData.append('title', formState.title);
      formData.append('type', formState.type);
      formData.append('category', formState.category);
      formData.append('date', formState.date);
      formData.append('time', formState.time);
      formData.append('venue', formState.venue);
      formData.append('participatingTeam', formState.participatingTeam);
      formData.append('chiefGuest', formState.chiefGuest);
      formData.append('status', formState.status);
      formData.append('details', formState.details);
      formData.append('colorCode', formState.colorCode);

      if (formState.imageFile) {
        formData.append('image', formState.imageFile);
      } else if (!formState.image && isEditing) {
        formData.append('image', '');
      }
      
      let response;
      if (isEditing) {
        response = await sportService.updateSport(formState.id, formData);
        alert('Sport event updated successfully!');
      } else {
        response = await sportService.createSport(formData);
        alert('New sport event added successfully!');
      }
      
      resetFormAndCloseModal();
      fetchSports();
      fetchStats();
    } catch (error) {
      console.error('❌ Error saving sport event:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to save sport event';
      alert(`Error: ${errorMessage}`);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sport event?')) {
      setAdminLoading(true);
      try {
        await sportService.deleteSport(id);
        alert('Sport event deleted successfully!');
        
        if (sportsData.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchSports();
        }
        
        fetchStats();
        if (isEditing && formState.id === id) {
          resetFormAndCloseModal();
        }
      } catch (error) {
        console.error('Error deleting sport event:', error);
        alert('Failed to delete event: ' + (error.response?.data?.message || error.message));
      } finally {
        setAdminLoading(false);
      }
    }
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'live': return 'bg-red-100 text-red-800 animate-pulse';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stats Cards Section - Achievement style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Trophy size={24} />} title="Total Events" value={stats?.totalEvents ?? '...'} loading={adminLoading} />
        <StatCard icon={<Calendar size={24} />} title="Upcoming" value={stats?.upcomingEvents ?? '...'} loading={adminLoading} />
        <StatCard icon={<ClipboardList size={24} />} title="Completed" value={stats?.completedEvents ?? '...'} loading={adminLoading} />
        <StatCard icon={<Users size={24} />} title="Live" value={stats?.liveEvents ?? '...'} loading={adminLoading} />
      </div>

      {/* Main Content Table - Achievement style */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Manage Sports Events</h2>
          <button
            onClick={() => { setIsEditing(false); setFormState(initialFormState); setIsModalOpen(true); }}
            className="flex items-center mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={18} className="mr-2" /> Add New Sport Event
          </button>
        </div>

        {/* Search and Filter - Achievement style */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Total: <strong>{totalItems}</strong> events
          </div>
        </div>

        {/* Sports Table - Achievement style */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading sports events...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sportsData.length > 0 ? (
                  sportsData.map(sport => (
                    <tr key={sport._id || sport.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sport.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {sport.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full font-semibold text-xs capitalize ${getStatusBadge(sport.status)}`}>
                          {sport.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>{new Date(sport.date).toLocaleDateString()}</div>
                        <div className="text-gray-500">{sport.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {sport.venue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                        <button 
                          onClick={() => handleEdit(sport)} 
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded transition-colors"
                          title="Edit Event"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(sport._id || sport.id)} 
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Delete Event"
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
                      <p>No sports events found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add/Edit Modal (keep your existing modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col m-4">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Edit Sport Event' : 'Add New Sport Event'}
              </h3>
              <button
                onClick={resetFormAndCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" name="title" id="title" value={formState.title} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required />
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Sport Type *</label>
                    <input type="text" name="type" id="type" value={formState.type} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required placeholder="e.g., Cricket, Football" />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select name="category" id="category" value={formState.category} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500">
                      <option value="outdoor">Outdoor</option>
                      <option value="indoor">Indoor</option>
                      <option value="mixed">Mixed</option>
                      <option value="tournament">Tournament</option>
                      <option value="championship">Championship</option>
                      <option value="league">League</option>
                      <option value="competition">Competition</option>
                      <option value="sports-meet">Sports Meet</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select name="status" id="status" value={formState.status} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500">
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input type="date" name="date" id="date" value={formState.date} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <input type="time" name="time" id="time" value={formState.time} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                    <input type="text" name="venue" id="venue" value={formState.venue} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required />
                  </div>
                  <div>
                    <label htmlFor="participatingTeam" className="block text-sm font-medium text-gray-700 mb-1">Participating Team(s) *</label>
                    <input type="text" name="participatingTeam" id="participatingTeam" value={formState.participatingTeam} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" required placeholder="e.g., Team A vs Team B" />
                  </div>
                  <div>
                    <label htmlFor="chiefGuest" className="block text-sm font-medium text-gray-700 mb-1">Chief Guest</label>
                    <input type="text" name="chiefGuest" id="chiefGuest" value={formState.chiefGuest} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label htmlFor="colorCode" className="block text-sm font-medium text-gray-700 mb-1">Color Code</label>
                    <input type="color" name="colorCode" id="colorCode" value={formState.colorCode} onChange={handleInputChange} className="w-full p-1 h-10 bg-white border border-gray-300 rounded-lg shadow-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                    <textarea name="details" id="details" rows="3" value={formState.details} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"></textarea>
                  </div>

                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Image
                    </label>
                    <input 
                      type="file" 
                      name="image" 
                      id="image" 
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageChange} 
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF, WebP. Max size: 10MB</p>
                  </div>
                  
                  {formState.imagePreview && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                      <div className="border border-gray-300 rounded-lg p-2">
                        <img 
                          src={formState.imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg shadow-sm" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0 p-6 border-t border-gray-200 bg-gray-50">
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