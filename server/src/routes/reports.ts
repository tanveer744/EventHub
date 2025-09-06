import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /reports/event-popularity
router.get('/event-popularity', async (req: Request, res: Response) => {
  try {
    const { collegeId } = req.query;
    
    if (!collegeId) {
      return res.status(400).json({ error: 'collegeId query parameter required' });
    }

    const query = `
      SELECT e.id AS event_id, e.title,
             COUNT(r.id) AS registrations
      FROM events e
      LEFT JOIN registrations r ON r.event_id = e.id
      WHERE e.college_id = $1
      GROUP BY e.id
      ORDER BY registrations DESC, e.id ASC
    `;
    
    const result = await pool.query(query, [collegeId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching event popularity:', error);
    res.status(500).json({ error: 'Failed to fetch event popularity' });
  }
});

// GET /reports/attendance
router.get('/attendance', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.query;
    
    if (!eventId) {
      return res.status(400).json({ error: 'eventId query parameter required' });
    }

    const query = `
      SELECT e.id AS event_id, e.title,
        CASE WHEN COUNT(r.id)=0 THEN 0
             ELSE ROUND(100.0 * SUM(CASE WHEN a.present THEN 1 ELSE 0 END) / COUNT(r.id), 2)
        END AS attendance_percent
      FROM events e
      LEFT JOIN registrations r ON r.event_id = e.id
      LEFT JOIN attendance a ON a.registration_id = r.id
      WHERE e.id = $1
      GROUP BY e.id
    `;
    
    const result = await pool.query(query, [eventId]);
    res.json(result.rows[0] || { event_id: eventId, title: null, attendance_percent: 0 });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// GET /reports/avg-feedback
router.get('/avg-feedback', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.query;
    
    if (!eventId) {
      return res.status(400).json({ error: 'eventId query parameter required' });
    }

    const query = `
      SELECT e.id AS event_id, e.title,
             ROUND(AVG(f.rating)::numeric, 2) AS avg_rating,
             COUNT(f.id) AS feedback_count
      FROM events e
      LEFT JOIN feedback f ON f.event_id = e.id
      WHERE e.id = $1
      GROUP BY e.id
    `;
    
    const result = await pool.query(query, [eventId]);
    res.json(result.rows[0] || { event_id: eventId, title: null, avg_rating: null, feedback_count: 0 });
  } catch (error) {
    console.error('Error fetching average feedback:', error);
    res.status(500).json({ error: 'Failed to fetch average feedback' });
  }
});

// GET /reports/student-participation
router.get('/student-participation', async (req: Request, res: Response) => {
  try {
    const { collegeId } = req.query;
    
    if (!collegeId) {
      return res.status(400).json({ error: 'collegeId query parameter required' });
    }

    const query = `
      SELECT s.id AS student_id, s.full_name, s.email,
             COALESCE(SUM(CASE WHEN a.present THEN 1 ELSE 0 END), 0) AS events_attended
      FROM students s
      JOIN registrations r ON r.student_id = s.id
      LEFT JOIN attendance a ON a.registration_id = r.id
      WHERE s.college_id = $1
      GROUP BY s.id
      ORDER BY events_attended DESC, s.id ASC
    `;
    
    const result = await pool.query(query, [collegeId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching student participation:', error);
    res.status(500).json({ error: 'Failed to fetch student participation' });
  }
});

export default router;
