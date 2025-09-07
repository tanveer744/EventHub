import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /attendance?eventId=X - Get all attendance records for an event
router.get('/', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.query;
    
    if (!eventId) {
      return res.status(400).json({ error: 'eventId query parameter required' });
    }

    const query = `
      SELECT a.*, r.student_id, r.event_id
      FROM attendance a
      JOIN registrations r ON r.id = a.registration_id
      WHERE r.event_id = $1
    `;
    
    const result = await pool.query(query, [eventId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

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

    // Check if attendance is already marked as present
    const existingAttendanceQuery = `
      SELECT present FROM attendance WHERE registration_id = $1
    `;
    const existingResult = await pool.query(existingAttendanceQuery, [registrationId]);
    
    // If attendance is already marked as present, prevent any changes
    if (existingResult.rows.length > 0 && existingResult.rows[0].present === true) {
      return res.status(400).json({ 
        error: 'Attendance cannot be revoked once marked as present',
        message: 'Once attendance is marked, it cannot be removed or changed.'
      });
    }

    const query = `
      INSERT INTO attendance (registration_id, present)
      VALUES ($1, $2)
      ON CONFLICT (registration_id) 
      DO UPDATE SET 
        present = CASE 
          WHEN attendance.present = true THEN attendance.present 
          ELSE $2 
        END,
        marked_at = CASE 
          WHEN attendance.present = true THEN attendance.marked_at 
          ELSE NOW() 
        END
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
