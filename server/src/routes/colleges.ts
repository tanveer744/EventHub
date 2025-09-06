import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /colleges
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    // Minimal validation
    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    const query = `
      INSERT INTO colleges (name)
      VALUES ($1)
      RETURNING *
    `;
    
    const result = await pool.query(query, [name]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({ error: 'Failed to create college' });
  }
});

export default router;
