import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /registrations?eventId=1
router.get('/', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.query;
    
    if (!eventId || typeof eventId !== 'string') {
      return res.status(400).json({ error: 'eventId query parameter is required' });
    }
    
    const query = `
      SELECT r.*, s.full_name, s.email, r.registered_at
      FROM registrations r
      JOIN students s ON r.student_id = s.id
      WHERE r.event_id = $1
      ORDER BY r.registered_at DESC
    `;
    
    const result = await pool.query(query, [parseInt(eventId, 10)]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// POST /registrations
router.post('/', async (req: Request, res: Response) => {
  try {
    const { eventId, studentId } = req.body;
    
    // Enhanced validation
    if (!eventId || !studentId) {
      return res.status(400).json({ error: 'Missing required fields: eventId and studentId are required' });
    }

    // Validate IDs are numbers
    if (isNaN(parseInt(eventId)) || isNaN(parseInt(studentId))) {
      return res.status(400).json({ error: 'Event ID and Student ID must be valid numbers' });
    }

    const query = `
      INSERT INTO registrations (event_id, student_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const result = await pool.query(query, [eventId, studentId]);
    res.json(result.rows[0]);
  } catch (error: unknown) {
    console.error('Error creating registration:', error);
    
    // Handle specific PostgreSQL errors
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code: string };
      if (dbError.code === '23505') {
        // Unique constraint violation (duplicate registration)
        return res.status(409).json({ error: 'Student already registered for this event' });
      } else if (dbError.code === '23503') {
        // Foreign key constraint violation (invalid student or event ID)
        return res.status(400).json({ error: 'Invalid student or event ID' });
      }
    }
    
    res.status(500).json({ error: 'Failed to create registration' });
  }
});

export default router;
