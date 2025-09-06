import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /registrations
router.post('/', async (req: Request, res: Response) => {
  try {
    const { eventId, studentId } = req.body;
    
    // Minimal validation
    if (!eventId || !studentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO registrations (event_id, student_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const result = await pool.query(query, [eventId, studentId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ error: 'Failed to create registration' });
  }
});

export default router;
