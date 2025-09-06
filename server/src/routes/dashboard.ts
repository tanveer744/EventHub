import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /dashboard/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { collegeId } = req.query;
    
    if (!collegeId) {
      return res.status(400).json({ error: 'collegeId query parameter required' });
    }

    // Get total events
    const eventsQuery = `
      SELECT COUNT(*) as total_events
      FROM events
      WHERE college_id = $1
    `;
    const eventsResult = await pool.query(eventsQuery, [collegeId]);
    const totalEvents = parseInt(eventsResult.rows[0].total_events);

    // Get active registrations (total registrations for college events)
    const registrationsQuery = `
      SELECT COUNT(r.*) as active_registrations
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE e.college_id = $1
    `;
    const registrationsResult = await pool.query(registrationsQuery, [collegeId]);
    const activeRegistrations = parseInt(registrationsResult.rows[0].active_registrations);

    // Get average attendance percentage
    const attendanceQuery = `
      SELECT 
        CASE WHEN COUNT(r.id) = 0 THEN 0
             ELSE ROUND(100.0 * SUM(CASE WHEN a.present THEN 1 ELSE 0 END) / COUNT(r.id), 2)
        END as avg_attendance
      FROM events e
      LEFT JOIN registrations r ON r.event_id = e.id
      LEFT JOIN attendance a ON a.registration_id = r.id
      WHERE e.college_id = $1
    `;
    const attendanceResult = await pool.query(attendanceQuery, [collegeId]);
    const avgAttendance = parseFloat(attendanceResult.rows[0].avg_attendance) || 0;

    // Get average student satisfaction (average feedback rating)
    const satisfactionQuery = `
      SELECT ROUND(AVG(f.rating)::numeric, 2) as avg_satisfaction
      FROM feedback f
      JOIN events e ON f.event_id = e.id
      WHERE e.college_id = $1
    `;
    const satisfactionResult = await pool.query(satisfactionQuery, [collegeId]);
    const avgSatisfaction = parseFloat(satisfactionResult.rows[0].avg_satisfaction) || 0;

    // Get previous month's data for trend calculation (using starts_at instead of created_at)
    const prevMonthEventsQuery = `
      SELECT COUNT(*) as prev_events
      FROM events
      WHERE college_id = $1 
      AND starts_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      AND starts_at < DATE_TRUNC('month', CURRENT_DATE)
    `;
    const prevMonthEventsResult = await pool.query(prevMonthEventsQuery, [collegeId]);
    const prevMonthEvents = parseInt(prevMonthEventsResult.rows[0].prev_events);

    const currentMonthEventsQuery = `
      SELECT COUNT(*) as current_events
      FROM events
      WHERE college_id = $1 
      AND starts_at >= DATE_TRUNC('month', CURRENT_DATE)
    `;
    const currentMonthEventsResult = await pool.query(currentMonthEventsQuery, [collegeId]);
    const currentMonthEvents = parseInt(currentMonthEventsResult.rows[0].current_events);

    // Calculate trends (simple month-over-month comparison)
    const eventsTrend = prevMonthEvents > 0 ? 
      Math.round(((currentMonthEvents - prevMonthEvents) / prevMonthEvents) * 100) : 
      currentMonthEvents > 0 ? 100 : 0;

    // For other metrics, we'll use simple positive trends as placeholder
    // In a real app, you'd calculate these properly with historical data
    const registrationsTrend = activeRegistrations > 50 ? 8 : 5;
    const attendanceTrend = avgAttendance > 80 ? 5 : 2;
    const satisfactionTrend = avgSatisfaction > 4 ? 3 : 1;

    const stats = {
      totalEvents: totalEvents,
      eventsTrend: eventsTrend,
      activeRegistrations: activeRegistrations,
      registrationsTrend: registrationsTrend,
      avgAttendance: Math.round(avgAttendance),
      attendanceTrend: attendanceTrend,
      avgSatisfaction: Math.round(avgSatisfaction * 20), // Convert 5-star to percentage
      satisfactionTrend: satisfactionTrend
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// GET /dashboard/registration-trends
router.get('/registration-trends', async (req: Request, res: Response) => {
  try {
    const { collegeId } = req.query;
    
    if (!collegeId) {
      return res.status(400).json({ error: 'collegeId query parameter required' });
    }

    // Get registration counts by month for the last 12 months
    const query = `
      SELECT 
        TO_CHAR(r.registered_at, 'Mon') as month,
        COUNT(r.id) as registrations
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE e.college_id = $1
      AND r.registered_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months')
      GROUP BY DATE_TRUNC('month', r.registered_at), TO_CHAR(r.registered_at, 'Mon')
      ORDER BY DATE_TRUNC('month', r.registered_at)
    `;
    
    const result = await pool.query(query, [collegeId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching registration trends:', error);
    res.status(500).json({ error: 'Failed to fetch registration trends' });
  }
});

// GET /dashboard/event-categories
router.get('/event-categories', async (req: Request, res: Response) => {
  try {
    const { collegeId } = req.query;
    
    if (!collegeId) {
      return res.status(400).json({ error: 'collegeId query parameter required' });
    }

    const query = `
      SELECT 
        event_type as category,
        COUNT(*) as count,
        ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) as percentage
      FROM events
      WHERE college_id = $1
      GROUP BY event_type
      ORDER BY count DESC
    `;
    
    const result = await pool.query(query, [collegeId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching event categories:', error);
    res.status(500).json({ error: 'Failed to fetch event categories' });
  }
});

export default router;
