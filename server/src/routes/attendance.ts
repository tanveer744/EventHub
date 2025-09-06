import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /attendance/mark
router.post('/mark', async (req: Request, res: Response) => {
  try {
    const { registrationId, present } = req.body;
    
    // Minimal validation
    if (!registrationId || typeof present !== 'boolean') {
      return res.status(400).json({ error: 'Missing required fields' });
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
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

export default router;
