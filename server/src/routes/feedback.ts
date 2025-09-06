import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /feedback?eventId=1
router.get('/', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.query;
    
    if (!eventId || typeof eventId !== 'string') {
      return res.status(400).json({ error: 'eventId query parameter is required' });
    }
    
    const query = `
      SELECT f.*, s.full_name, s.email
      FROM feedback f
      JOIN students s ON f.student_id = s.id
      WHERE f.event_id = $1
      ORDER BY f.given_at DESC
    `;
    
    const result = await pool.query(query, [parseInt(eventId, 10)]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// POST /feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    const { eventId, studentId, rating, comment } = req.body;
    
    // Enhanced validation
    if (!eventId || !studentId || rating === undefined || rating === null) {
      return res.status(400).json({ error: 'Missing required fields: eventId, studentId, and rating are required' });
    }

    // Validate IDs are numbers
    if (isNaN(parseInt(eventId)) || isNaN(parseInt(studentId))) {
      return res.status(400).json({ error: 'Event ID and Student ID must be valid numbers' });
    }

    // Validate rating is a number between 1 and 5
    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }

    // Validate comment length if provided
    if (comment && typeof comment === 'string' && comment.length > 1000) {
      return res.status(400).json({ error: 'Comment cannot exceed 1000 characters' });
    }

    const query = `
      INSERT INTO feedback (event_id, student_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (event_id, student_id)
      DO UPDATE SET rating = $3, comment = $4, given_at = NOW()
      RETURNING *
    `;
    
    const result = await pool.query(query, [eventId, studentId, ratingNum, comment || null]);
    res.json(result.rows[0]);
  } catch (error: unknown) {
    console.error('Error submitting feedback:', error);
    
    // Handle specific PostgreSQL errors
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code: string };
      if (dbError.code === '23503') {
        // Foreign key constraint violation (invalid event or student ID)
        return res.status(400).json({ error: 'Invalid event or student ID' });
      }
    }
    
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

export default router;
