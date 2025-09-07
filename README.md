# EventHub - Campus Event Management System

## 1. Project Overview

This is my submission for the Webknot Technologies Campus Drive Assignment. The task was to build a Campus Event Management Platform with an admin portal for college staff and a student interface for event participation.

I decided to build this as a single web application instead of separate mobile/web apps because the assigment problem clearly states not to over complicate things and also my project outptut covers all the required functionalities. The system handles event creation, student registration, attendance tracking, and feedback collection - basically everything mentioned in the problem statement.

I used AI tools (mainly ChatGPT , Perpelxity, Copilot ) to help brainstorm the database design and API structure, but all the final decisions and code implementation are mine. You can check the ai_logs folder for my conversation screenshots.

## 2. Features

### For Students:
- Browse all upcoming events with details.
- One-click registration for events (no more paper forms!)
- Rate events from 1-5 stars and leave feedback

### For Admins:
- Create and manage events with full details
- View registration lists and attendance reports
- View various reports (event popularity, student participation, etc.)
- Track feedback scores for each event

## 3. Tech Stack

I picked these technologies based on what I know and what seemed practical for the assignment requirements:

- **Frontend**: React with TypeScript and Vite for fast development
- **UI Components**: Shadcn-ui with Tailwind CSS for clean, responsive design
- **Backend**: Node.js with Express - familiar stack for me
- **Database**: SQLite with Prisma ORM - easy to set up and handles the scale mentioned (50 colleges, 500 students each)
- **Authentication**: Not done as not clearly mentioned in the Assignment but added a dropdown to switch between users.


## 4. Setup Instructions

### Prerequisites:
- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git for cloning the repository

### Installation Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/tanveer744/EventHub.git
   cd EventHub
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ..
   npm install
   ```

4. Start the development servers:
   ```bash
   # Terminal 1 - Backend (runs on port 3001)
   cd server
   npm run dev
   
   # Terminal 2 - Frontend (runs on port 8080)
   cd ..
   npm run dev
   ```

5. Open http://localhost:8080/ in your browser


## 5. How to Use

 Open http://localhost:8080/ in your browser 

### Student Workflow:
1. Switch between list of Users.
2. Browse events on the homepage - you can see hackathons, workshops, fests, etc.
3. Click on any event to see details (description, venue, timing)
4. Hit "Register" to sign up for events
5. After the event, rate it (1-5 stars) and leave feedback

### Admin Workflow:
1. Access the admin dashboard from the navigation
2. Create new events - fill in all details like title, Type, date, time and venue.
3. View registration lists for each event
4. Access reports section to see:
   - Total Events
   - Total registrations per event
   - Attendance percentages
   - Average feedback scores
   - Event Popularity Report
   - Student participation statistics
   - Top 3 most active students report
   - Flexible reports by event type (Workshop/Fest/Seminar)

## 6. Database Design

**Core Tables:**

1. **colleges**
   - `id` (Primary Key, Serial)
   - `name` (Text, Unique) - College name
   
2. **students** 
   - `id` (Primary Key, Serial)
   - `college_id` (Foreign Key → colleges.id)
   - `full_name` (Text)
   - `email` (Text)
   - Unique constraint on (college_id, email) to prevent duplicate emails per college

3. **events**
   - `id` (Primary Key, Serial) 
   - `college_id` (Foreign Key → colleges.id)
   - `title` (Text)
   - `event_type` (Text) - Constrained to: 'Hackathon', 'Workshop', 'TechTalk', 'Fest', 'Seminar'
   - `starts_at` (Timestamptz)
   - `ends_at` (Timestamptz)
   - `location` (Text)

4. **registrations**
   - `id` (Primary Key, Serial)
   - `event_id` (Foreign Key → events.id, CASCADE DELETE)
   - `student_id` (Foreign Key → students.id, CASCADE DELETE)
   - `registered_at` (Timestamp, defaults to NOW())
   - Unique constraint on (event_id, student_id) to prevent duplicate registrations

5. **attendance**
   - `id` (Primary Key, Serial)
   - `registration_id` (Foreign Key → registrations.id, CASCADE DELETE, UNIQUE)
   - `present` (Boolean)
   - `marked_at` (Timestamptz, defaults to NOW())

6. **feedback**
   - `id` (Primary Key, Serial)
   - `event_id` (Foreign Key → events.id, CASCADE DELETE)
   - `student_id` (Foreign Key → students.id, CASCADE DELETE)
   - `rating` (Integer, constrained between 1-5)
   - `comment` (Text, optional)
   - `given_at` (Timestamptz, defaults to NOW())
   - Unique constraint on (event_id, student_id) to allow only one feedback per student per event


## 7. API Endpoints

### College Management:
- `POST /api/colleges` - Create a new college

### Student Management:
- `GET /api/students?collegeId=X` - Get all students (optionally filtered by college)
- `POST /api/students` - Create a new student

### Event Management:
- `GET /api/events?collegeId=X` - Get all events for a college
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get specific event details

### Registration System:
- `GET /api/registrations?eventId=X` - Get registrations for an event
- `GET /api/registrations?studentId=X` - Get registrations for a student
- `POST /api/registrations` - Register student for event (requires eventId, studentId)

### Attendance Tracking:
- `GET /api/attendance?eventId=X` - Get attendance records for an event
- `POST /api/attendance/mark` - Mark attendance (requires registrationId, present boolean)

### Feedback Collection:
- `GET /api/feedback?eventId=X` - Get all feedback for an event
- `POST /api/feedback` - Submit event feedback (eventId, studentId, rating 1-5, optional comment)

### Reports (Assignment Requirements):
- `GET /api/reports/event-popularity?collegeId=X` - Events sorted by registration count
- `GET /api/reports/attendance?eventId=X` - Attendance percentage for specific event
- `GET /api/reports/avg-feedback?eventId=X` - Average feedback rating for event
- `GET /api/reports/student-participation?collegeId=X` - Top 3 most active students

### Dashboard Analytics:
- `GET /api/dashboard/stats?collegeId=X` - Overall statistics (total events, registrations, avg attendance, satisfaction)
- `GET /api/dashboard/registration-trends?collegeId=X` - Registration trends over time
- `GET /api/dashboard/event-categories?collegeId=X` - Event distribution by type

### System Health:
- `GET /health` - Server health check

## 8. Things I Learned

Working on this assignment taught me a lot about full-stack development:

### Technical Skills:
- Database design for real-world scenarios with relationships
- RESTful API design and implementation

### Problem Solving:
- How to handle edge cases like duplicate registrations
- Managing state between registration and attendance
- Dealing with cancelled events and refunds
- Optimizing queries for the scale requirements (50 colleges)

### AI-Assisted Development:
- Used ChatGPT to brainstorm database schema options
- Got help with complex SQL queries for reports
- Used Github Copilot for autocomplete while coding
- But made all architectural decisions myself

## 9. Challenges Faced

### Database Design:
The difficult part was designing the schema to handle the scale requirements. I had to decide whether to keep data separate per college or in one large dataset. I went with a unified approach using collegeId fields because it makes cross-college analytics possible.

### Edge Cases:
- Handling duplicate registrations (prevented at API level)
- Managing feedback for cancelled events (disabled form)
- Dealing with students who register but don't attend

## 10. Future Improvements

If I were to continue developing this system:

### Additional Features I'd Add:
- Authentication using JWT 
- Separate sites for admin and student or separate login for each.
- Email notifications for event updates
- Event capacity management and waitlists
- Integration with college calendar systems
- Mobile-responsive design improvements
- Real-time dashboard updates

### Scaling Improvements:
- Add caching layer (Redis) for frequently accessed data
- Implement proper logging and monitoring
- Add API rate limiting and security headers

## 11. Screenshots

I've included screenshots of the working application in the `/screenshots` folder. These show:
- Admin dashboard with event creation
- Student event browsing interface
- Event detail pages with registration
- Reports and analytics views
- QR code generation and scanning

## 12. Final Thoughts

This assignment was really challenging but I learned a lot about building full-stack applications. The requirements were clear and it forced me to think about real-world problems like scaling, data relationships, and user workflows.

### What I'm Proud Of:
- Successfully implemented all core requirements (event creation, registration, attendance, feedback)
- Added the bonus features (top students report, event type filtering)
- Handled the scale considerations for 50 colleges properly
- Clean, working code with proper error handling

### Assignment-Specific Notes:
- All required reports are working (event popularity, student participation, attendance percentage)
- Database is designed to handle the specified scale (50 colleges × 500 students × 20 events)
- AI conversation logs are in the `/ai_logs` folder as requested

This project taught me that building something that actually works is way harder than just following tutorials. You have to think about edge cases, user experience, data consistency, and so many other things that don't come up in simple examples.

## Repository

GitHub repo: https://github.com/tanveer744/EventHub

---
*Submitted for Webknot Technologies Campus Drive Assignment*  
*By: Tanveer - September 7, 2025*
