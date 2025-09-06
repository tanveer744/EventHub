import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /attendance/mark
router.post('/mark', async (req: Request, res: Response) => {
  try {
    const { registrationId, present } = req.body;
    
    // Enhanced validation
    if (!registrationId || typeof present !== 'boolean') {
      return res.status(400).json({ error: 'Missing required fields: registrationId (number) and present (boolean) are required' });
    }

    // Validate registrationId is a number
    if (isNaN(parseInt(registrationId))) {
      return res.status(400).json({ error: 'Registration ID must be a valid number' });
    }

    const query = `
      INSERT INTO attendance (registration_id, present)
      VALUES ($1, $2)
      ON CONFLICT (registration_id) 
      DO UPDATE SET present = $2, marked_at = NOW()
      RETURNING *
    `;
    
    const result = await pool.query(query, [registrationId, present]);
    res.json(result.rows[0]);
  } catch (error: unknown) {
    console.error('Error marking attendance:', error);
    
    // Handle specific PostgreSQL errors
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code: string };
      if (dbError.code === '23503') {
        // Foreign key constraint violation (invalid registration ID)
        return res.status(400).json({ error: 'Invalid registration ID' });
      }
    }
    
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

export default router;
