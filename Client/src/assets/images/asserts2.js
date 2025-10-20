import Science from './feature/Science.png';
import Cultural from './feature/cultural.png';
import ParentMeet from './feature/parentmeet.png';
import Award from './feature/Award.png';

export const eventData = [
  {
    "id": 1,
    "title": "Annual Sports Day",
    "status": "completed",
    "date": "12 Oct 2025",
    "time": "8:30 AM",
    "venue": "School Ground",
    "organizer": "Physical Education Dept",
    "audience": "All Students + Parents",
    "description": "Inter-house competitions & final matches.",
    "days_left": 0,
    "image_source": Award,
    "image_alt": "Children playing sports"
  },
  {
    "id": 2,
    "title": "Science Exhibition",
    "status": "canceled", // Fixed: lowercase for consistency
    "date": "29 Oct 2025",
    "time": "8:30 AM",
    "venue": "Science Hall", // Fixed: capitalized
    "organizer": "Science Club",
    "audience": "All Students + Parents",
    "description": "Showcasing innovative science projects and experiments.",
    "days_left": 19,
    "image_source": Science,
    "image_alt": "Students performing a science experiment"
  },
  {
    "id": 3,
    "title": "Parent-Teacher Meeting (PTM)",
    "status": "upcoming",
    "date": "12 Dec 2025",
    "time": "8:30 AM",
    "venue": "School Auditorium", // Fixed: more appropriate venue
    "organizer": "Administration Dept", // Fixed: more appropriate organizer
    "audience": "All Students + Parents",
    "description": "Discussion about student progress and academic performance.",
    "days_left": 34,
    "image_source": ParentMeet,
    "image_alt": "Parents and teacher meeting"
  },
  {
    "id": 4,
    "title": "Annual Cultural Fest",
    "status": "upcoming",
    "date": "20 Dec 2025",
    "time": "6:00 PM",
    "venue": "School Auditorium",
    "organizer": "Cultural Committee",
    "audience": "All Students + Community",
    "description": "Talent show, drama, and music performances.",
    "days_left": 42,
    "image_source": Cultural,
    "image_alt": "Students performing cultural activities"
  }
];

import Profile from './feature/profile.jpeg';
export const image=
[
  {
    "id": 1,
    "src": Profile,
    "alt": "Profile Image"
  }
]