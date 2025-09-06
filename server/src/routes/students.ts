import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /students?collegeId=1
router.get('/', async (req: Request, res: Response) => {
  try {
    const { collegeId } = req.query;
    
    let query = 'SELECT * FROM students';
    let params: (string | number)[] = [];
    
    if (collegeId && typeof collegeId === 'string') {
      query += ' WHERE college_id = $1';
      params = [parseInt(collegeId, 10)];
    }
    
    query += ' ORDER BY full_name';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// POST /students
router.post('/', async (req: Request, res: Response) => {
  try {
    const { collegeId, fullName, email } = req.body;
    
    // Enhanced validation
    if (!collegeId || !fullName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate collegeId is a number
    if (isNaN(parseInt(collegeId))) {
      return res.status(400).json({ error: 'College ID must be a valid number' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate full name (should have at least first and last name)
    if (fullName.trim().split(/\s+/).length < 2) {
      return res.status(400).json({ error: 'Full name should include at least first and last name' });
    }

    const query = `
      INSERT INTO students (college_id, full_name, email)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [collegeId, fullName.trim(), email.toLowerCase()]);
    res.json(result.rows[0]);
  } catch (error: unknown) {
    console.error('Error creating student:', error);
    
    // Handle specific PostgreSQL errors
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code: string };
      if (dbError.code === '23505') {
        // Unique constraint violation (duplicate email)
        return res.status(409).json({ error: 'Student with this email already exists' });
      } else if (dbError.code === '23503') {
        // Foreign key constraint violation (invalid college ID)
        return res.status(400).json({ error: 'Invalid college ID' });
      }
    }
    
    res.status(500).json({ error: 'Failed to create student' });
  }
});

export default router;
