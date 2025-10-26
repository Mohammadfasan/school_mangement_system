// pages/Sport.jsx
import React, { useState, useEffect } from 'react';
import { sportService } from '../services/sportService';
import { Calendar, MapPin, Users, Trophy, Search, Filter } from 'lucide-react';

const Sport = () => {
  const [sports, setSports] = useState([]);
  const [filteredSports, setFilteredSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = ['upcoming', 'live', 'completed', 'cancelled'];
  const categoryOptions = ['outdoor', 'indoor', 'mixed', 'tournament', 'championship', 'league', 'competition', 'sports-meet'];

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    filterSports();
  }, [sports, selectedStatus, selectedCategory, searchTerm]);

  const fetchSports = async () => {
    try {
      setLoading(true);
      const response = await sportService.getAllSports();
      setSports(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching sports:', error);
      alert('Failed to fetch sports events');
    } finally {
      setLoading(false);
    }
  };

  const filterSports = () => {
    let filtered = sports;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(sport => sport.status === selectedStatus);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(sport => sport.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(sport =>
        sport.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSports(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'upcoming': 'bg-blue-100 text-blue-800 border-blue-200',
      'live': 'bg-green-100 text-green-800 border-green-200',
      'completed': 'bg-gray-100 text-gray-800 border-gray-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'outdoor': 'bg-green-100 text-green-800 border-green-200',
      'indoor': 'bg-blue-100 text-blue-800 border-blue-200',
      'mixed': 'bg-purple-100 text-purple-800 border-purple-200',
      'tournament': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'championship': 'bg-red-100 text-red-800 border-red-200',
      'league': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'competition': 'bg-pink-100 text-pink-800 border-pink-200',
      'sports-meet': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sports events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Sports Events
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with all the exciting sports events, tournaments, and competitions happening in our school.
              From inter-school championships to friendly matches, never miss a game!
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events by title, type, or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categoryOptions.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-lg text-gray-700">
            Showing <span className="font-semibold text-green-600">{filteredSports.length}</span> 
            {filteredSports.length === 1 ? ' event' : ' events'}
          </p>
        </div>

        {/* Sports Events Grid */}
        {filteredSports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSports.map((sport) => (
              <div 
                key={sport._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Event Header with Color Accent */}
                <div 
                  className="h-2"
                  style={{ backgroundColor: sport.colorCode }}
                ></div>
                
                <div className="p-6">
                  {/* Event Title and Type */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{sport.title}</h3>
                    <p className="text-lg text-green-600 font-semibold">{sport.type}</p>
                  </div>

                  {/* Status and Category Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sport.status)} border`}>
                      {sport.status}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(sport.category)} border`}>
                      {sport.category}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={18} className="mr-3 text-gray-400" />
                      <div>
                        <div className="font-medium">{formatDate(sport.date)}</div>
                        <div className="text-sm text-gray-500">{sport.time}</div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-3 text-gray-400" />
                      <span>{sport.venue}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Users size={18} className="mr-3 text-gray-400" />
                      <span>{sport.participatingTeam}</span>
                    </div>

                    {sport.chiefGuest && (
                      <div className="flex items-center text-gray-600">
                        <Trophy size={18} className="mr-3 text-gray-400" />
                        <span>Chief Guest: {sport.chiefGuest}</span>
                      </div>
                    )}
                  </div>

                  {/* Event Description */}
                  {sport.details && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{sport.details}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-6xl mb-4">⚽</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Sports Events Found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' 
                ? "Try adjusting your search criteria or filters to find more events."
                : "There are currently no sports events scheduled."}
            </p>
            {(searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sport;