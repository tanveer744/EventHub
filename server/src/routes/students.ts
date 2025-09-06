import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /students
router.post('/', async (req: Request, res: Response) => {
  try {
    const { collegeId, fullName, email } = req.body;
    
    // Minimal validation
    if (!collegeId || !fullName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO students (college_id, full_name, email)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [collegeId, fullName, email]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

export default router;
