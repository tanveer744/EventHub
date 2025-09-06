import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /events
router.post('/', async (req: Request, res: Response) => {
  try {
    const { collegeId, title, eventType, startsAt, endsAt, location } = req.body;
    
    // Enhanced validation
    if (!collegeId || !title || !eventType || !startsAt || !endsAt || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate collegeId is a number
    if (isNaN(parseInt(collegeId))) {
      return res.status(400).json({ error: 'College ID must be a valid number' });
    }

    // Validate dates
    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format for startsAt or endsAt' });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ error: 'Event end time must be after start time' });
    }

    // Validate event type
    const validEventTypes = ['Hackathon', 'Workshop', 'TechTalk', 'Fest', 'Seminar'];
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    const query = `
      INSERT INTO events (college_id, title, event_type, starts_at, ends_at, location)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await pool.query(query, [collegeId, title, eventType, startsAt, endsAt, location]);
    res.json(result.rows[0]);
  } catch (error: unknown) {
    console.error('Error creating event:', error);
    
    // Handle specific PostgreSQL errors
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code: string };
      if (dbError.code === '23503') {
        // Foreign key constraint violation (invalid college ID)
        return res.status(400).json({ error: 'Invalid college ID' });
      }
    }
    
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

// GET /events/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid event ID required' });
    }

    const query = `
      SELECT * FROM events
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [parseInt(id)]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

export default router;
