# EventHub - Campus Event Management System

## 1. Project Overview

This is a campus event management system I built to help students and admins manage college events. Students can browse events, register, check-in, and give feedback, while admins can create events and view reports. I made this to learn full-stack development and to solve the problem of tracking event participation in my college.

## 2. Features

### For Students:
- Browse upcoming events with filters
- Register for events with one click
- Check-in to events using a QR code
- Rate events and give feedback (1-5 stars)
- View event history and participation stats

### For Admins:
- Create and manage events with details and images
- Generate and scan QR codes for check-ins
- View registration and attendance reports
- See event popularity and feedback scores
- Export reports as CSV

## 3. Tech Stack

I used these technologies because they're popular and have good documentation:
- **Frontend**: React with TypeScript and Vite
- **UI**: Shadcn components with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: SQLite (for simplicity)
- **Authentication**: JWT tokens

## 4. Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git (for version control)

### Steps to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/tanveer744/EventHub.git
   cd EventHub
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../
   npm install
   ```

3. Set up the database:
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```

4. Start the development servers:
   ```bash
   # In one terminal (backend)
   cd server
   npm run dev
   
   # In another terminal (frontend)
   cd ..
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 5. How to Use

### Login Credentials
- **Student**:
  - Email: student@example.com
  - Password: password123

- **Admin**:
  - Email: admin@example.com
  - Password: admin123

### Basic Flow
1. **Students** can:
   - Browse events on the home page
   - Click "Register" to sign up for events
   - Check-in using the QR code at the event
   - Rate the event after it ends

2. **Admins** can:
   - Create new events with details and images
   - View registration lists
   - Generate QR codes for check-ins
   - See reports on event performance

## 6. Database Design

I used Prisma as my ORM. Here are the main tables:

- `User` - Stores user information (students and admins)
- `Event` - Contains event details
- `Registration` - Tracks which students registered for which events
- `Attendance` - Records actual event attendance
- `Feedback` - Stores student ratings and comments

## 7. API Endpoints

Here are the main API endpoints:

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - New user registration

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (admin only)
- `GET /api/events/:id` - Get event details

### Registration
- `POST /api/events/:id/register` - Register for an event
- `GET /api/users/me/events` - Get my registered events

### Admin
- `GET /api/admin/events` - Get all events (admin view)
- `GET /api/admin/reports/attendance` - Attendance reports

## 8. Things I Learned

- How to structure a full-stack application
- Authentication with JWT
- Database design and relationships
- File uploads for event images
- Generating and scanning QR codes
- Creating and exporting reports

## 9. Challenges Faced

1. **Authentication**: Had trouble with JWT tokens at first
2. **File Uploads**: Took time to implement image uploads
3. **Database Relations**: Figuring out how to connect users to events was tricky
4. **State Management**: Managing global state took some trial and error

## 10. Future Improvements

If I had more time, I would:
- Add push notifications for event reminders
- Implement a chat feature for event discussions
- Add event categories and tags
- Create a mobile app version
- Add more detailed analytics

## 11. Screenshots

Check the `/screenshots` folder for images of the app in action.

## 12. Final Thoughts

This project helped me learn a ton about full-stack development. It's not perfect, but I'm proud of how it turned out. Feel free to use this as a reference or build upon it!

## Repository

Check out the code on GitHub: [https://github.com/tanveer744/EventHub](https://github.com/tanveer744/EventHub)

---
*Built with ❤️ by Tanveer*

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7f007629-2130-4535-af69-0c0782171273) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
