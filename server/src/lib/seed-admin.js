import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from './db.js';
const schema = z.object({ ADMIN_EMAIL: z.string().email(), ADMIN_PASSWORD: z.string().min(14), ADMIN_NAME: z.string().min(1).default('Store owner') });
try {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = schema.parse(process.env);
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await pool.query(`INSERT INTO admins(email,password_hash,display_name,role) VALUES($1,$2,$3,'owner') ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash, display_name=EXCLUDED.display_name, active=TRUE`, [ADMIN_EMAIL.toLowerCase(), hash, ADMIN_NAME]);
  console.log(`Admin provisioned for ${ADMIN_EMAIL.toLowerCase()}. Remove ADMIN_PASSWORD from your shell after use.`);
} catch (e) { console.error(e.message); process.exitCode = 1; }
finally { await pool.end(); }
