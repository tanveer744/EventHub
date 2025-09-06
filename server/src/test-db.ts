import pool from './db';

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    
    const collegesResult = await pool.query('SELECT * FROM colleges');
    console.log('Colleges:', collegesResult.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
