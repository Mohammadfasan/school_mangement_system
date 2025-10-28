// src/pages/Event.jsx
import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';

const Event = () => {
  const [filter, setFilter] = useState('all');
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Function to get status text
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'upcoming':
        return 'Upcoming';
      case 'canceled':
        return 'Canceled';
      default:
        return status;
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to get category color
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'sport':
        return 'bg-blue-500';
      case 'academic':
        return 'bg-green-500';
      case 'art':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Filter events based on status
  const filteredEvents = eventsData.filter(event => {
    if (filter === 'all') return true;
    return event.status.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 pt-20">
      {/* Header */}
      <div className="text-center mb-8 mt-20">
        <h1 className="text-4xl font-bold text-[#059669] mb-2">Welcome to Events</h1>
        <p className="text-gray-600 text-lg">Stay updated with all school events and activities</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg shadow-sm p-2 flex space-x-2">
          {['all', 'upcoming', 'completed', 'canceled'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                filter === filterType
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Events Counter */}
      <div className="max-w-7xl mx-auto mb-6">
        <p className="text-gray-600">
          Showing {filteredEvents.length} of {eventsData.length} events
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredEvents.map((event) => (
          <div
            key={event._id || event.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            {/* Event Image with Gradient Overlay */}
            <div className="h-48 overflow-hidden relative">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              
              {/* Status Badge on Image */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                  {getStatusText(event.status)}
                </span>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
              </div>
            </div>

            {/* Event Content */}
            <div className="p-6">
              {/* Event Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h2>

              {/* Award Badge */}
              {event.award && (
                <div className="mb-3">
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full border border-yellow-200">
                    🏆 {event.award}
                  </span>
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{formatDate(event.date)}</p>
                    {event.time && (
                      <p className="text-xs text-gray-500">{event.time}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">{event.venue}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">{event.student}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">{event.organizer || 'School Administration'}</span>
                </div>
              </div>

              {/* Audience & Days Left */}
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-gray-500">{event.audience || 'All Students'}</span>
                {event.days_left > 0 && event.status === 'upcoming' && (
                  <span className="text-orange-600 font-semibold">
                    {event.days_left} days left
                  </span>
                )}
                {event.status === 'completed' && (
                  <span className="text-green-600 font-semibold">
                    ✓ Completed
                  </span>
                )}
                {event.status === 'canceled' && (
                  <span className="text-red-600 font-semibold">
                    ✗ Canceled
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                {event.description || 'No description available.'}
              </p>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "There are no events at the moment. Please check back later." 
              : `There are no ${filter} events at the moment.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Event;