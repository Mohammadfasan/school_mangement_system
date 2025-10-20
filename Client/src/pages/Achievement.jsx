import React, { useState, useMemo } from 'react';
import { achievementData } from '../assets/images/assert';
import { 
  Trophy, 
  User,
  GraduationCap,
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
};

// Map categories to Tailwind colors for buttons
const categoryColors = {
  Sport: 'bg-[#059669] hover:bg-emerald-700',
  Academic: 'bg-blue-500 hover:bg-blue-600',
  Cultural: 'bg-pink-500 hover:bg-pink-600',
  Leadership: 'bg-amber-500 hover:bg-amber-600',
};

// Map categories to actual color values for card backgrounds
const categoryBackgroundColors = {
  Sport: '#059669',
  Academic: '#3b82f6',
  Cultural: '#5b0a3cff',
  Leadership: '#503506ff',
};

const AchievementCard = ({ achievement }) => {
  const getBackgroundColor = (category) => {
    return categoryBackgroundColors[category] || '#059669'; // Default to Sport color
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
          <span className="font-semibold">Date: {achievement.date}</span>
        </div>

        {/* Venue */}
        <div className="flex items-center text-sm sm:text-base">
          <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
          <span className="font-semibold">Venue: {achievement.venue}</span>
        </div>
      </div>
    </div>
  );
};

const Achievement = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = useMemo(() => {
    const allCategories = achievementData.map(item => item.category);
    return ['All', ...new Set(allCategories)]; 
  }, []);

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'All') {
      return achievementData;
    }
    return achievementData.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);
  
  // Find the highlight card to put it first, if filtering allows it
  const highlightCard = filteredAchievements.find(item => item.highlight);
  const otherCards = filteredAchievements.filter(item => !item.highlight || item.id !== highlightCard?.id);
  const cardsToDisplay = highlightCard ? [highlightCard, ...otherCards] : otherCards;
  
  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 mt-30">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#059669] mb-3 ">
            Achievement
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Students and teachers can view a card-based list of achievements earned in academics, sports, cultural,
            and other activities. Each achievement card shows the award title, student name, grade, date, and
            category. Color-coding helps to quickly identify achievement type (e.g., sports, academic, cultural). 
            A search bar and filters allow users to find achievements by student, class, category, or year. Clicking 
            on a card reveals more details such as event name, description, and uploaded certificates or photos. 
            Teachers and admins can add new achievements with a simple form, including title, student/team, date, 
            category, and attachments. A highlight section showcases top or recent achievements for quick recognition.
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
                } ${selectedCategory === category ? 'text-white' : ''} `}
            >
              {category !== 'All' && categoryIcons[category]}
              <span className={category !== 'All' ? 'ml-2' : ''}>{category}</span>
            </button>
          ))}
        </div>
        
        {/* Achievement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {cardsToDisplay.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}

          {cardsToDisplay.length === 0 && (
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