import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    const { eventId, studentId, rating, comment } = req.body;
    
    // Minimal validation
    if (!eventId || !studentId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Missing required fields or invalid rating' });
    }

    const query = `
      INSERT INTO feedback (event_id, student_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (event_id, student_id)
      DO UPDATE SET rating = $3, comment = $4, given_at = NOW()
      RETURNING *
    `;
    
    const result = await pool.query(query, [eventId, studentId, rating, comment || null]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

export default router;
