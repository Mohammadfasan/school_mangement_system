import React from 'react';
import sportsCardsData from '../assets/images/assert';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  UserCheck, 
  Info,
  Trophy,
  Award,
  Star,
  CheckCircle, // New icon for 'completed'
  XCircle, // New icon for 'cancelled'
  Clock as ClockIcon // Used for 'upcoming' status icon
} from 'lucide-react';

const SportsCard = () => {
  // Category color mapping
  const categoryColors = {
    outdoor: 'bg-green-50 text-green-700 border-green-200',
    indoor: 'bg-blue-50 text-blue-700 border-blue-200',
    mixed: 'bg-orange-50 text-orange-700 border-orange-200',
    tournament: 'bg-purple-50 text-purple-700 border-purple-200',
    championship: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    league: 'bg-red-50 text-red-700 border-red-200',
    competition: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'sports-meet': 'bg-pink-50 text-pink-700 border-pink-200'
  };

  // Icon mapping for different event types
  const eventIcons = {
    tournament: <Trophy className="w-4 h-4" />,
    championship: <Award className="w-4 h-4" />,
    league: <Users className="w-4 h-4" />,
    competition: <Star className="w-4 h-4" />,
    'sports-meet': <Award className="w-4 h-4" />
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return {
          text: 'Upcoming',
          classes: 'bg-blue-500 text-white',
          icon: <ClockIcon className="w-3 h-3 mr-1" />
        };
      case 'completed':
        return {
          text: 'Completed',
          classes: 'bg-green-500 text-white',
          icon: <CheckCircle className="w-3 h-3 mr-1" />
        };
      case 'cancelled':
        return {
          text: 'Cancelled',
          classes: 'bg-red-500 text-white',
          icon: <XCircle className="w-3 h-3 mr-1" />
        };
      default:
        return {
          text: 'Info',
          classes: 'bg-gray-500 text-white',
          icon: <Info className="w-3 h-3 mr-1" />
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center mb-3 sm:mb-4 mt-30">
          <h1 className="text-3xl sm:text-4xl font-extrabold  text-[#059669]">
            Welcome to Sport
          </h1>
        </div>
        <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
          Students and teachers can see a visual overview of all sports activities and events in the school. 
          Each sport or event is displayed as a card box, showing the sport name, date, time, and venue.
        </p>
      </div>
      
     
      
      {/* Sports Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {sportsCardsData.map((card) => {
            const statusBadge = getStatusBadge(card.status || 'info');
            
            return (
              <div
                key={card.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border-l-4 relative overflow-hidden"
                style={{ borderLeftColor: card.colorCode }}
              >
                
                {/* Status Badge - Dynamic based on status */}
                <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-semibold shadow-md ${statusBadge.classes}`}>
                  {statusBadge.icon}
                  {statusBadge.text}
                </div>

                {/* Card Content */}
                <div className="relative p-4 sm:p-6 z-10">
                  
                  {/* Header with Image and Title */}
                  <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                    <div className="relative">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0 border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-300"
                      />
                      {/* Small icon at bottom right of image */}
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 sm:p-1 shadow-md">
                        {eventIcons[card.type.toLowerCase()] || <Trophy className="w-3 h-3 text-yellow-600" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                        {card.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold mt-1 border ${
                        categoryColors[card.category.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {eventIcons[card.type.toLowerCase()] || <Trophy className="w-3 h-3 mr-1" />} 
                        {card.type}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 sm:space-y-3 mb-4">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                      <span className="truncate"><strong className="text-gray-700">Date:</strong> {card.date}</span>
                    </div>

                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-3 text-red-500 flex-shrink-0" />
                      <span className="truncate"><strong className="text-gray-700">Venue:</strong> {card.venue}</span>
                    </div>

                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                      <span className="truncate"><strong className="text-gray-700">Time:</strong> {card.time}</span>
                    </div>

                    <div className="flex items-start text-xs sm:text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-3 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-gray-700">Participating Team:</strong> {card.participatingTeam}</span>
                    </div>

                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <UserCheck className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                      <span className="truncate"><strong className="text-gray-700">Chief Guest:</strong> {card.chiefGuest}</span>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="flex items-start text-xs sm:text-sm text-gray-600">
                      <Info className="w-4 h-4 mr-3 text-cyan-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-700">Details:</strong> 
                        <p className="mt-1 text-gray-600 leading-relaxed line-clamp-2">{card.details}</p>
                      </div>
                    </div>
                  </div>

                  {/* Optional: Hover Action Button for Mobile */}
                  <div className="mt-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md">
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
     

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto mt-8 sm:mt-12 text-center px-2">
        <p className="text-gray-500 text-xs sm:text-sm">
          Color-coding indicates the type of sport or event (e.g., indoor, outdoor, tournament). Status badges now show if an event is upcoming, completed, or cancelled.
        </p>
      </div>
    </div>
  );
};

export default SportsCard;