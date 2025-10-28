// src/pages/Achievement.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { achievementService } from '../services/achievementService';
import { 
  Trophy, 
  User,
  Calendar,
  MapPin,
  Star,
  BookOpen,
  Palette,
  Users,
  Feather
} from 'lucide-react';

const categoryIcons = {
  Sport: <Trophy className="w-5 h-5" />,
  Academic: <BookOpen className="w-5 h-5" />,
  Cultural: <Palette className="w-5 h-5" />,
  Leadership: <Users className="w-5 h-5" />,
  Art: <Feather className="w-5 h-5" />,
  Other: <Star className="w-5 h-5" />,
};

// Map categories to Tailwind colors for buttons
const categoryColors = {
  Sport: 'bg-[#059669] hover:bg-emerald-700',
  Academic: 'bg-blue-500 hover:bg-blue-600',
  Cultural: 'bg-pink-500 hover:bg-pink-600',
  Leadership: 'bg-amber-500 hover:bg-amber-600',
  Art: 'bg-purple-500 hover:bg-purple-600',
  Other: 'bg-gray-500 hover:bg-gray-600',
};

// Map categories to actual color values for card backgrounds
const categoryBackgroundColors = {
  Sport: '#059669',
  Academic: '#3b82f6',
  Cultural: '#ec4899',
  Leadership: '#f59e0b',
  Art: '#8b5cf6',
  Other: '#6b7280',
};

const AchievementCard = ({ achievement }) => {
  const getBackgroundColor = (category) => {
    return categoryBackgroundColors[category] || '#059669';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className={`relative p-5 sm:p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-[1.02] 
        text-white overflow-hidden`}
      style={{ backgroundColor: getBackgroundColor(achievement.category) }}
    >
      
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-black/10"></div>
      
      {/* Highlight Badge */}
      {achievement.highlight && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
          <Star className="w-3 h-3 mr-1 fill-yellow-900" />
          Highlight
        </div>
      )}

      {/* Image & Title Section */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
          {/* Main Achievement Image */}
          <div className="w-full h-full rounded-full bg-white/20 p-1 shadow-2xl flex items-center justify-center overflow-hidden">
            <img 
              src={achievement.image} 
              alt={achievement.student} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {/* Award Icon Badge */}
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-lg">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-700 text-yellow-900" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold leading-tight flex-1">
          {achievement.title}
        </h3>
      </div>
      
      {/* Details List */}
      <div className="space-y-3 mt-4">
        {/* Award */}
        <div className="flex items-center text-sm sm:text-base">
          <Trophy className="w-4 h-4 mr-3 flex-shrink-0" />
          <span className="font-semibold">{achievement.award}</span>
        </div>
        
        {/* Student/Grade */}
        <div className="flex items-center text-sm sm:text-base">
          <User className="w-4 h-4 mr-3 flex-shrink-0" />
          <span className="font-semibold">Student: {achievement.student} (Grade {achievement.grade})</span>
        </div>

        {/* Date */}
        <div className="flex items-center text-sm sm:text-base">
          <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
          <span className="font-semibold">Date: {formatDate(achievement.date)}</span>
        </div>

        {/* Venue */}
        <div className="flex items-center text-sm sm:text-base">
          <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
          <span className="font-semibold">Venue: {achievement.venue}</span>
        </div>

        {/* Description */}
        {achievement.description && (
          <div className="pt-3 border-t border-white/20">
            <p className="text-sm opacity-90">{achievement.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Achievement = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [achievementsData, setAchievementsData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch achievements from backend
  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementService.getAllAchievements();
      setAchievementsData(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      alert('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const allCategories = achievementsData.map(item => item.category);
    return ['All', ...new Set(allCategories)]; 
  }, [achievementsData]);

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'All') {
      return achievementsData;
    }
    return achievementsData.filter(item => item.category === selectedCategory);
  }, [selectedCategory, achievementsData]);
  
  // Sort achievements: highlighted first, then by date
  const sortedAchievements = useMemo(() => {
    return [...filteredAchievements].sort((a, b) => {
      if (a.highlight && !b.highlight) return -1;
      if (!a.highlight && b.highlight) return 1;
      return new Date(b.date) - new Date(a.date);
    });
  }, [filteredAchievements]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 mt-30">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#059669] mb-3">
            Achievement Gallery
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Celebrating the outstanding accomplishments of our students in academics, sports, cultural activities, 
            leadership, and arts. Each achievement represents dedication, hard work, and excellence.
          </p>
        </div>
        
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base 
                transition-all duration-200 shadow-md ${
                  selectedCategory === category
                    ? categoryColors[category] || 'bg-gray-700 hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${selectedCategory === category ? 'text-white' : ''}`}
            >
              {category !== 'All' && categoryIcons[category]}
              <span className={category !== 'All' ? 'ml-2' : ''}>{category}</span>
            </button>
          ))}
        </div>

        {/* Achievement Counter */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Showing {sortedAchievements.length} of {achievementsData.length} achievements
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>
        
        {/* Achievement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {sortedAchievements.map((achievement) => (
            <AchievementCard key={achievement._id || achievement.id} achievement={achievement} />
          ))}

          {sortedAchievements.length === 0 && (
            <div className="md:col-span-2 xl:col-span-3 text-center py-10 text-gray-500 text-lg">
              No achievements found for the selected category.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Achievement;
