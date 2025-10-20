import principal from './feature/principal.jpg'
import Student from './feature/student.png'
import  Volleyball  from './feature/vollyball.png';
import  Cricket  from './feature/cricket.png';
import  Football  from './feature/football .png';
import   Sportmeet  from './feature/sportmeet.png';
import athletic from './feature/athletic.png';





export const testimonialData = {
  
  "testimonials": [
    {
      "name": "Mr. Rahman",
      "title": "Principal",
      "testimonialText": "This School Management System has made our daily work so easy. Attendance, results, and communication are now just one click away!",
      "image": principal,
      "rating": 4.5,
      "ratingDescription": "Four and a half stars"
    },
    {
        name: "Ms. Anika",
        title: "Student",
        testimonialText: "I love how I can check my grades and assignments online. It helps me stay organized and on top of my studies!",
        image: Student,
        rating: 4.8,
        ratingDescription: "Four and eight tenths stars"
    }
    // You would add more testimonial objects here
  ]
};
export const timetableData = {
  grades: [
    {
      "grade": "11",
      "hallNo": "11",
      "room": "Room 11",
      "timetable": [
        {
          "period": 1,
          "monday": { "subject": "Mathematics", "color": "bg-blue-100" },
          "tuesday": { "subject": "Physics", "color": "bg-green-100" },
          "wednesday": { "subject": "Mathematics", "color": "bg-blue-100" },
          "thursday": { "subject": "Chemistry", "color": "bg-purple-100" },
          "friday": { "subject": "English", "color": "bg-yellow-100" }
        },
        {
          "period": 2,
          "monday": { "subject": "Physics", "color": "bg-green-100" },
          "tuesday": { "subject": "Chemistry", "color": "bg-purple-100" },
          "wednesday": { "subject": "English", "color": "bg-yellow-100" },
          "thursday": { "subject": "Mathematics", "color": "bg-blue-100" },
          "friday": { "subject": "Biology", "color": "bg-red-100" }
        },
        {
          "period": 3,
          "monday": { "subject": "English", "color": "bg-yellow-100" },
          "tuesday": { "subject": "Mathematics", "color": "bg-blue-100" },
          "wednesday": { "subject": "Physics", "color": "bg-green-100" },
          "thursday": { "subject": "ICT", "color": "bg-indigo-100" },
          "friday": { "subject": "Chemistry", "color": "bg-purple-100" }
        },
        {
          "period": 4,
          "monday": { "subject": "Biology", "color": "bg-red-100" },
          "tuesday": { "subject": "ICT", "color": "bg-indigo-100" },
          "wednesday": { "subject": "Chemistry", "color": "bg-purple-100" },
          "thursday": { "subject": "Physics", "color": "bg-green-100" },
          "friday": { "subject": "Mathematics", "color": "bg-blue-100" }
        }
      ],
      "interval": [
        {
          "period": 5,
          "monday": { "subject": "History", "color": "bg-pink-100" },
          "tuesday": { "subject": "Geography", "color": "bg-orange-100" },
          "wednesday": { "subject": "History", "color": "bg-pink-100" },
          "thursday": { "subject": "Geography", "color": "bg-orange-100" },
          "friday": { "subject": "Art", "color": "bg-teal-100" }
        },
        {
          "period": 6,
          "monday": { "subject": "Geography", "color": "bg-orange-100" },
          "tuesday": { "subject": "Art", "color": "bg-teal-100" },
          "wednesday": { "subject": "Music", "color": "bg-cyan-100" },
          "thursday": { "subject": "History", "color": "bg-pink-100" },
          "friday": { "subject": "Physical Education", "color": "bg-lime-100" }
        },
        {
          "period": 7,
          "monday": { "subject": "Art", "color": "bg-teal-100" },
          "tuesday": { "subject": "Music", "color": "bg-cyan-100" },
          "wednesday": { "subject": "Physical Education", "color": "bg-lime-100" },
          "thursday": { "subject": "Art", "color": "bg-teal-100" },
          "friday": { "subject": "Music", "color": "bg-cyan-100" }
        },
        {
          "period": 8,
          "monday": { "subject": "Library", "color": "bg-amber-100" },
          "tuesday": { "subject": "Guidance", "color": "bg-rose-100" },
          "wednesday": { "subject": "Library", "color": "bg-amber-100" },
          "thursday": { "subject": "Guidance", "color": "bg-rose-100" },
          "friday": { "subject": "Free Period", "color": "bg-gray-100" }
        }
      ]
    },
    {
      "grade": "12",
      "hallNo": "12",
      "room": "Room 12",
      "timetable": [
        {
          "period": 1,
          "monday": { "subject": "Advanced Math", "color": "bg-blue-100" },
          "tuesday": { "subject": "Physics", "color": "bg-green-100" },
          "wednesday": { "subject": "Chemistry", "color": "bg-purple-100" },
          "thursday": { "subject": "Biology", "color": "bg-red-100" },
          "friday": { "subject": "English Lit", "color": "bg-yellow-100" }
        },
        {
          "period": 2,
          "monday": { "subject": "Chemistry", "color": "bg-purple-100" },
          "tuesday": { "subject": "Advanced Math", "color": "bg-blue-100" },
          "wednesday": { "subject": "Physics", "color": "bg-green-100" },
          "thursday": { "subject": "English Lit", "color": "bg-yellow-100" },
          "friday": { "subject": "ICT", "color": "bg-indigo-100" }
        },
        {
          "period": 3,
          "monday": { "subject": "Biology", "color": "bg-red-100" },
          "tuesday": { "subject": "English Lit", "color": "bg-yellow-100" },
          "wednesday": { "subject": "Advanced Math", "color": "bg-blue-100" },
          "thursday": { "subject": "Physics", "color": "bg-green-100" },
          "friday": { "subject": "Chemistry", "color": "bg-purple-100" }
        },
        {
          "period": 4,
          "monday": { "subject": "ICT", "color": "bg-indigo-100" },
          "tuesday": { "subject": "Biology", "color": "bg-red-100" },
          "wednesday": { "subject": "English Lit", "color": "bg-yellow-100" },
          "thursday": { "subject": "Advanced Math", "color": "bg-blue-100" },
          "friday": { "subject": "Physics", "color": "bg-green-100" }
        }
      ],
      "interval": [
        {
          "period": 5,
          "monday": { "subject": "Economics", "color": "bg-pink-100" },
          "tuesday": { "subject": "Accounting", "color": "bg-orange-100" },
          "wednesday": { "subject": "Economics", "color": "bg-pink-100" },
          "thursday": { "subject": "Accounting", "color": "bg-orange-100" },
          "friday": { "subject": "Business Studies", "color": "bg-teal-100" }
        },
        {
          "period": 6,
          "monday": { "subject": "Accounting", "color": "bg-orange-100" },
          "tuesday": { "subject": "Business Studies", "color": "bg-teal-100" },
          "wednesday": { "subject": "Art", "color": "bg-cyan-100" },
          "thursday": { "subject": "Economics", "color": "bg-pink-100" },
          "friday": { "subject": "Physical Education", "color": "bg-lime-100" }
        },
        {
          "period": 7,
          "monday": { "subject": "Business Studies", "color": "bg-teal-100" },
          "tuesday": { "subject": "Art", "color": "bg-cyan-100" },
          "wednesday": { "subject": "Physical Education", "color": "bg-lime-100" },
          "thursday": { "subject": "Business Studies", "color": "bg-teal-100" },
          "friday": { "subject": "Art", "color": "bg-cyan-100" }
        },
        {
          "period": 8,
          "monday": { "subject": "Career Guidance", "color": "bg-amber-100" },
          "tuesday": { "subject": "Study Period", "color": "bg-rose-100" },
          "wednesday": { "subject": "Career Guidance", "color": "bg-amber-100" },
          "thursday": { "subject": "Study Period", "color": "bg-rose-100" },
          "friday": { "subject": "Free Period", "color": "bg-gray-100" }
        }
      ]
    },
    {
      "grade": "13",
      "hallNo": "13",
      "room": "Room 13",
      "timetable": [
        {
          "period": 1,
          "monday": { "subject": "Combined Math", "color": "bg-blue-100" },
          "tuesday": { "subject": "Physics", "color": "bg-green-100" },
          "wednesday": { "subject": "Chemistry", "color": "bg-purple-100" },
          "thursday": { "subject": "ICT", "color": "bg-indigo-100" },
          "friday": { "subject": "English", "color": "bg-yellow-100" }
        },
        {
          "period": 2,
          "monday": { "subject": "Physics", "color": "bg-green-100" },
          "tuesday": { "subject": "Chemistry", "color": "bg-purple-100" },
          "wednesday": { "subject": "Combined Math", "color": "bg-blue-100" },
          "thursday": { "subject": "English", "color": "bg-yellow-100" },
          "friday": { "subject": "Biology", "color": "bg-red-100" }
        },
        {
          "period": 3,
          "monday": { "subject": "Chemistry", "color": "bg-purple-100" },
          "tuesday": { "subject": "ICT", "color": "bg-indigo-100" },
          "wednesday": { "subject": "Physics", "color": "bg-green-100" },
          "thursday": { "subject": "Combined Math", "color": "bg-blue-100" },
          "friday": { "subject": "English", "color": "bg-yellow-100" }
        },
        {
          "period": 4,
          "monday": { "subject": "Biology", "color": "bg-red-100" },
          "tuesday": { "subject": "English", "color": "bg-yellow-100" },
          "wednesday": { "subject": "ICT", "color": "bg-indigo-100" },
          "thursday": { "subject": "Physics", "color": "bg-green-100" },
          "friday": { "subject": "Combined Math", "color": "bg-blue-100" }
        }
      ],
      "interval": [
        {
          "period": 5,
          "monday": { "subject": "Agriculture", "color": "bg-pink-100" },
          "tuesday": { "subject": "Sinhala", "color": "bg-orange-100" },
          "wednesday": { "subject": "Agriculture", "color": "bg-pink-100" },
          "thursday": { "subject": "Sinhala", "color": "bg-orange-100" },
          "friday": { "subject": "Tamil", "color": "bg-teal-100" }
        },
        {
          "period": 6,
          "monday": { "subject": "Sinhala", "color": "bg-orange-100" },
          "tuesday": { "subject": "Tamil", "color": "bg-teal-100" },
          "wednesday": { "subject": "Health", "color": "bg-cyan-100" },
          "thursday": { "subject": "Agriculture", "color": "bg-pink-100" },
          "friday": { "subject": "Physical Education", "color": "bg-lime-100" }
        },
        {
          "period": 7,
          "monday": { "subject": "Tamil", "color": "bg-teal-100" },
          "tuesday": { "subject": "Health", "color": "bg-cyan-100" },
          "wednesday": { "subject": "Physical Education", "color": "bg-lime-100" },
          "thursday": { "subject": "Tamil", "color": "bg-teal-100" },
          "friday": { "subject": "Health", "color": "bg-cyan-100" }
        },
        {
          "period": 8,
          "monday": { "subject": "Media", "color": "bg-amber-100" },
          "tuesday": { "subject": "Drama", "color": "bg-rose-100" },
          "wednesday": { "subject": "Media", "color": "bg-amber-100" },
          "thursday": { "subject": "Drama", "color": "bg-rose-100" },
          "friday": { "subject": "Free Period", "color": "bg-gray-100" }
        }
      ]
    }
  ]
};
export const studentsData = {
  "students": [
    {
      "name": "Alice Johnson",
      "grade": "Grade 1",
      "address": "123 Maple Street, Springfield",
      "gender": "Female"
    },
    {
      "name": "Bob Smith",
      "grade": "Grade 2",
      "address": "456 Oak Avenue, Springfield",
      "gender": "Male"
    },
    {
      "name": "Carol Davis",
      "grade": "Grade 3",
      "address": "789 Pine Road, Springfield",
      "gender": "Female"
    },
    {
      "name": "David Wilson",
      "grade": "Grade 4",
      "address": "321 Elm Street, Springfield",
      "gender": "Male"
    },
    {
      "name": "Emma Brown",
      "grade": "Grade 1",
      "address": "654 Birch Lane, Springfield",
      "gender": "Female"
    },
    {
      "name": "Frank Miller",
      "grade": "Grade 2",
      "address": "987 Cedar Road, Springfield",
      "gender": "Male"
    },
    {
      "name": "Grace Taylor",
      "grade": "Grade 3",
      "address": "147 Walnut Avenue, Springfield",
      "gender": "Female"
    },
    {
      "name": "Henry Anderson",
      "grade": "Grade 4",
      "address": "258 Spruce Street, Springfield",
      "gender": "Male"
    },
    {
      "name": "Isabella Martinez",
      "grade": "Grade 1",
      "address": "369 Willow Lane, Springfield",
      "gender": "Female"
    },
    {
      "name": "Jack Thompson",
      "grade": "Grade 2",
      "address": "741 Aspen Road, Springfield",
      "gender": "Male"
    }
  ]
};

export const sportsCardsData = [
  {
    "id": 1,
    "title": "Volleyball Tournament",
    "date": "15 Dec 2024",
    "venue": "Indoor Hall",
    "time": "8:00 AM - 4:00 PM",
    "participatingTeam": "School Volleyball Team",
    "chiefGuest": "Principal",
    "details": "A full-day event with multiple volleyball matches.",
    "image": Volleyball,
    "type": "tournament",
    "category": "indoor", // Changed to indoor for variety
    "colorCode": "#20B2AA", // Light Sea Green
    "status": "upcoming"
  },
  {
    "id": 2,
    "title": "Cricket Championship Finals",
    "date": "20 Sep 2024", // Set in the past
    "venue": "Cricket Field",
    "time": "9:00 AM - 5:00 PM",
    "participatingTeam": "School Cricket Team",
    "chiefGuest": "Sports Minister",
    "details": "Inter-school cricket championship final match.",
    "image": Cricket,
    "type": "championship",
    "category": "outdoor",
    "colorCode": "#FFD700", // Gold
    "status": "completed"
  },
  {
    "id": 3,
    "title": "Football League Matchday 3",
    "date": "25 Nov 2024",
    "venue": "Main Field",
    "time": "8:30 AM - 3:30 PM",
    "participatingTeam": "House Teams A & B",
    "chiefGuest": "District Collector",
    "details": "League match between the top two house teams.",
    "image": Football,
    "type": "league",
    "category": "outdoor",
    "colorCode": "#1E90FF", // Dodger Blue
    "status": "upcoming"
  },
  {
    "id": 4,
    "title": "Annual Sports Meet",
    "date": "30 Dec 2024",
    "venue": "School Stadium",
    "time": "8:00 AM - 6:00 PM",
    "participatingTeam": "All Houses",
    "chiefGuest": "Education Minister",
    "details": "The major annual track and field event.",
    "image": Sportmeet,
    "type": "sports-meet",
    "category": "mixed",
    "colorCode": "#8A2BE2", // Blue Violet
    "status": "upcoming"
  },
  {
    "id": 5,
    "title": "Athletics Tryouts",
    "date": "5 Oct 2024", // Set in the past and cancelled
    "venue": "School Track",
    "time": "7:30 AM - 2:00 PM",
    "participatingTeam": "School Athletics Team",
    "chiefGuest": "N/A",
    "details": "Tryouts for the upcoming inter-school athletics competition.",
    "image": athletic,
    "type": "competition",
    "category": "outdoor",
    "colorCode": "#FF6347", // Tomato
    "status": "cancelled"
  },
  {
    "id": 6,
    "title": "Badminton Singles Tournament",
    "date": "10 Dec 2024",
    "venue": "Indoor Hall",
    "time": "10:00 AM - 5:00 PM",
    "participatingTeam": "Grade 10 & 11",
    "chiefGuest": "Mr. Rahman",
    "details": "Singles elimination tournament for senior students.",
    "image": Student, // Using student image as placeholder
    "type": "tournament",
    "category": "indoor",
    "colorCode": "#3CB371", // Medium Sea Green
    "status": "upcoming"
  }
];

export { Volleyball, Cricket, Football, Sportmeet, athletic };
export default sportsCardsData;

import ScienceFacility from './feature/ScienceFair.png';
import LeadershipCamp from './feature/leadership-award.png';
import MusicConcert from './feature/MusicCompetition.png';
import AcadamicAward from './feature/AcademicAward.png';
import sports from './feature/sports-achievement.png';
import cultural from './feature/cultural-event.png';
import Debate from './feature/debate-championship.png';
export const achievementData = [
  {
    id: 1,
    title: "Inter-School Football Championship",
    award: "1st Place",
    student: "Ahmed",
    grade: "10",
    date: "12 Sept 2025",
    venue: "Colombo Sports Complex",
    description: "The school football team secured the championship title in a thrilling final match against Royal College.",
    category: "Sport",
    image: sports,
    highlight: true,
    colorCode: "bg-[#059669]", // Green for Sport, matches your screenshot
  },
  {
    id: 2,
    title: "National Science Fair",
    award: "Best Innovation Award",
    student: "Isuru Perera",
    grade: "12",
    date: "05 Oct 2025",
    venue: "Bandaranaike Memorial International Conference Hall",
    description: "Isuru's project on sustainable water purification won the top innovation prize.",
    category: "Academic",
    image: ScienceFacility,
    highlight: true,
    colorCode: "bg-[#3B82F6]", // Blue for Academic
  },
  {
    id: 3,
    title: "All-Island Music Competition",
    award: "Best Vocalist",
    student: "Nimali Silva",
    grade: "11",
    date: "28 Aug 2025",
    venue: "Nelum Pokuna Theatre",
    description: "Nimali delivered a stunning performance, earning the Best Vocalist award.",
    category: "Cultural",
    image: MusicConcert,
    highlight: false,
    colorCode: "bg-[#EC4899]", // Pink for Cultural
  },
  {
    id: 4,
    title: "Annual Leadership Camp",
    award: "Outstanding Leader",
    student: "Priyanka Rathnayake",
    grade: "13",
    date: "10 Nov 2025",
    venue: "School Auditorium",
    description: "Priyanka demonstrated exceptional teamwork and initiative during the camp's challenges.",
    category: "Leadership",
    image: LeadershipCamp,
    highlight: false,
    colorCode: "bg-[#F59E0B]", // Amber for Leadership
  },
  {
    id: 5,
    title: "Inter-School Debate Championship",
    award: "Runner-up",
    student: "The Debate Team",
    grade: "9-13",
    date: "20 Sept 2025",
    venue: "Royal College Main Hall",
    description: "The team performed admirably, making it to the finals of the prestigious debate championship.",
    category: "Academic",
    image: Debate,
    highlight: false,
    colorCode: "bg-[#3B82F6]", // Blue for Academic
  },
  {
    id: 6,
    title: "Grade 10 Top Scorer",
    award: "Academic Excellence",
    student: "Kamal De Silva",
    grade: "10",
    date: "15 Jan 2025",
    venue: "School Prize Giving",
    description: "Kamal achieved the highest overall GPA in his grade for the previous year.",
    category: "Academic",
    image: AcadamicAward,
    highlight: true,
    colorCode: "bg-[#3B82F6]", 
  },
  
];


