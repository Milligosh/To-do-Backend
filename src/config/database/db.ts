//import { Pool } from 'pg';
import pkg from 'pg';
const { Pool } = pkg;
import { configDotenv } from 'dotenv';
configDotenv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database');
    release();
  }
});

export default pool;
