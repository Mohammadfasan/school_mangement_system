#  School Management System (MERN Stack)

A full-stack, responsive School Management System designed to streamline academic and extracurricular activities for admins, teachers, and students. Built with the modern MERN stack and inspired by a detailed Figma UI/UX prototype.

![MERN Stack](https://img.shields.io/badge/MERN-Full--Stack-green)
![Status](https://img.shields.io/badge/Status-Locally%20Deployed-success)



##  Features

###  Home Screen
Smooth and intuitive navigation across all system modules.

###  Dashboard
A comprehensive overview for users, featuring:
- Up-to-date class timetable
- Latest school announcements
- Upcoming events calendar

###  Event Management
Easily create, manage, and view all school events and functions.

###  Sports Module
Dedicated section to track sports activities, schedules, and student achievements in athletics.

###  Achievements Screen
Showcase and celebrate academic and extracurricular awards earned by students.

###  Timetable Screen
A well-organized and clear view of daily and weekly class schedules.

###  Student Details
Admins can efficiently manage and view comprehensive student records and profiles.

###  Announcements
A central hub for sharing important news and updates with the entire school community.

##  User Roles

###  Admin
- Full system access.
- Manage students, teachers, and classes.
- Create and update timetables.
- Post and manage school-wide announcements.
- Oversee events and achievements.

###  User (Students & Teachers)
- Personalized dashboard.
- View personal/class timetables.
- Browse school events and announcements.
- Check academic and sports achievements.

##  Tech Stack

*   **Frontend:** React.js, Context API (or Redux), CSS3
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Authentication:** JWT (JSON Web Tokens)
*   **Deployment:** AWS (In Progress)

##  Screenshots

*(You can add your screenshots here like this)*

| Dashboard | Event Management | Timetable |
|:---:|:---:|:---:|
| <img src="screenshots/dashboard.png" width="250"> | <img src="screenshots/events.png" width="250"> | <img src="screenshots/timetable.png" width="250"> |

##  Installation

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js (v14 or above)
- MongoDB (Local instance or MongoDB Atlas)
- Git

### Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../client
    npm install
    ```

## 🔑 Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```env
# Server Port
PORT=5000
