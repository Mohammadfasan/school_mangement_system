// pages/Sport.jsx
import React, { useState, useEffect } from 'react';
import { sportService } from '../services/sportService';
import { Calendar, MapPin, Users, Trophy, Search, Filter, Clock, Award } from 'lucide-react';

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
      
      // Handle different response structures
      let sportsData = [];
      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          sportsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          sportsData = response.data;
        } else if (response.data.sports && Array.isArray(response.data.sports)) {
          sportsData = response.data.sports;
        } else if (Array.isArray(response.data)) {
          sportsData = response.data;
        }
      }
      
      console.log('🏆 Sports loaded:', sportsData.length);
      setSports(sportsData);
    } catch (error) {
      console.error('❌ Error fetching sports:', error);
      alert('Failed to fetch sports events');
      setSports([]);
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
        sport.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.participatingTeam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.chiefGuest?.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (!dateString) return 'Date not set';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get image URL - handle both base64 and regular URLs
  const getImageUrl = (image) => {
    if (!image) return null;
    
    if (image.startsWith('data:image/')) {
      return image; // Base64 image
    } else if (image.startsWith('http')) {
      return image; // External URL
    } else {
      // Relative path - prepend with base URL if needed
      return image.startsWith('/') ? image : `/${image}`;
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'outdoor':
        return '🏕️';
      case 'indoor':
        return '🏢';
      case 'tournament':
        return '🏆';
      case 'championship':
        return '🥇';
      case 'league':
        return '⚽';
      case 'competition':
        return '🎯';
      case 'sports-meet':
        return '🤝';
      default:
        return '🏃';
    }
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
          <div className="text-center mt-30">
            <h1 className="text-2xl sm:text-4xl font-bold text-[#059669] mb-4">
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
                  placeholder="Search events by title, type, venue, team, or chief guest..."
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
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedStatus !== 'all' && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedStatus)} border`}>
                {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                <button 
                  onClick={() => setSelectedStatus('all')}
                  className="ml-2 hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedCategory)} border`}>
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')}
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="ml-2 hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
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
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-lg text-gray-700">
            Showing <span className="font-semibold text-green-600">{filteredSports.length}</span> 
            {filteredSports.length === 1 ? ' event' : ' events'}
            {selectedStatus !== 'all' && ` (${selectedStatus})`}
            {selectedCategory !== 'all' && ` in ${selectedCategory.replace('-', ' ')}`}
          </p>
        </div>

        {/* Sports Events Grid */}
        {filteredSports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSports.map((sport) => {
              const imageUrl = getImageUrl(sport.image);
              
              return (
                <div 
                  key={sport._id || sport.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Event Image */}
                  <div className="h-48 overflow-hidden relative">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={sport.title || 'Sport event'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          // Create fallback if it doesn't exist
                          if (!e.target.nextSibling) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500';
                            fallback.innerHTML = `
                              <div class="text-white text-center">
                                <div class="text-3xl mb-2">${getCategoryIcon(sport.category)}</div>
                                <span class="text-sm font-medium">${sport.type || 'Sport'}</span>
                              </div>
                            `;
                            e.target.parentNode.appendChild(fallback);
                          }
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback when no image */}
                    {!imageUrl && (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
                        <div className="text-white text-center">
                          <div className="text-3xl mb-2">{getCategoryIcon(sport.category)}</div>
                          <span className="text-sm font-medium">{sport.type || 'Sport Event'}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Status and Category Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sport.status)} border`}>
                        {sport.status || 'unknown'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(sport.category)} border`}>
                        {sport.category || 'general'}
                      </span>
                    </div>

                    {/* Color Code Accent */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: sport.colorCode || '#059669' }}
                    ></div>
                  </div>

                  <div className="p-6">
                    {/* Event Title and Type */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {sport.title || 'Untitled Event'}
                      </h3>
                      <p className="text-lg text-green-600 font-semibold">
                        {sport.type || 'Sports Event'}
                      </p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-3">
                      {/* Date & Time */}
                      <div className="flex items-center text-gray-600">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                          <Calendar size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {formatDate(sport.date)}
                          </div>
                          {sport.time && (
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" />
                              {sport.time}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Venue */}
                      {sport.venue && (
                        <div className="flex items-center text-gray-600">
                          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                            <MapPin size={16} className="text-green-600" />
                          </div>
                          <span className="text-sm">{sport.venue}</span>
                        </div>
                      )}

                      {/* Participating Team */}
                      {sport.participatingTeam && (
                        <div className="flex items-center text-gray-600">
                          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                            <Users size={16} className="text-purple-600" />
                          </div>
                          <span className="text-sm">{sport.participatingTeam}</span>
                        </div>
                      )}

                      {/* Chief Guest */}
                      {sport.chiefGuest && (
                        <div className="flex items-center text-gray-600">
                          <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
                            <Award size={16} className="text-yellow-600" />
                          </div>
                          <span className="text-sm">Chief Guest: {sport.chiefGuest}</span>
                        </div>
                      )}
                    </div>

                    {/* Event Description */}
                    {sport.details && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 line-clamp-3">{sport.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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