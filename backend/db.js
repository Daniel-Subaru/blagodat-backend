import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

// DigitalOcean Managed Database: задайте DATABASE_URL (або DB_*) і DB_SSL=true
const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

export const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl })
  : new pg.Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'blagodat_shop',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl,
    });

pool.on('error', (err) => console.error('Unexpected DB error', err));
