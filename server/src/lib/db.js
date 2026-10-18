import pg from 'pg';
const { Pool } = pg;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
export const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: Number(process.env.DB_POOL_MAX || 10), idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000, ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined });
pool.on('error', err => console.error('Unexpected PostgreSQL pool error', err));
