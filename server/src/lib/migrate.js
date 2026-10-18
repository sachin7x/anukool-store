import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';
try {
  const sql = await readFile(new URL('../../db/schema.sql', import.meta.url), 'utf8');
  await pool.query(sql);
  console.log('Database schema applied.');
} catch (error) { console.error(error); process.exitCode = 1; }
finally { await pool.end(); }
