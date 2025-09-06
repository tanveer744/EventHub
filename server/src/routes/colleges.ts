import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /colleges
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    // Enhanced validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Missing required field: name (string) is required' });
    }

    // Validate college name length and format
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return res.status(400).json({ error: 'College name must be at least 2 characters long' });
    }

    if (trimmedName.length > 100) {
      return res.status(400).json({ error: 'College name cannot exceed 100 characters' });
    }

    const query = `
      INSERT INTO colleges (name)
      VALUES ($1)
      RETURNING *
    `;
    
    const result = await pool.query(query, [trimmedName]);
    res.json(result.rows[0]);
  } catch (error: unknown) {
    console.error('Error creating college:', error);
    
    // Handle specific PostgreSQL errors
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code: string };
      if (dbError.code === '23505') {
        // Unique constraint violation (duplicate college name)
        return res.status(409).json({ error: 'College with this name already exists' });
      }
    }
    
    res.status(500).json({ error: 'Failed to create college' });
  }
});

export default router;
