import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /events
router.post('/', async (req: Request, res: Response) => {
  try {
    const { collegeId, title, eventType, startsAt, endsAt, location } = req.body;
    
    // Minimal validation
    if (!collegeId || !title || !eventType || !startsAt || !endsAt || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO events (college_id, title, event_type, starts_at, ends_at, location)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await pool.query(query, [collegeId, title, eventType, startsAt, endsAt, location]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// GET /events
router.get('/', async (req: Request, res: Response) => {
  try {
    const { collegeId } = req.query;
    
    if (!collegeId) {
      return res.status(400).json({ error: 'collegeId query parameter required' });
    }

    const query = `
      SELECT * FROM events
      WHERE college_id = $1
      ORDER BY starts_at ASC
    `;
    
    const result = await pool.query(query, [collegeId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

export default router;
