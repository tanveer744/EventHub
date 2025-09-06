import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import collegesRouter from './routes/colleges';
import eventsRouter from './routes/events';
import studentsRouter from './routes/students';
import registrationsRouter from './routes/registrations';
import attendanceRouter from './routes/attendance';
import feedbackRouter from './routes/feedback';
import reportsRouter from './routes/reports';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Mount API routes
app.use('/api/colleges', collegesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/reports', reportsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
