import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from '../lib/db.js';
import { requireAdmin } from '../middleware/security.js';
const router = Router();
const loginSchema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(200) });
router.get('/me', (req,res) => res.json({ admin: req.session?.admin || null }));
router.post('/login', async (req,res,next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({error:'Enter a valid email and password.'});
    const email = parsed.data.email.toLowerCase();
    const { rows } = await pool.query('SELECT id,email,password_hash,display_name,role,active FROM admins WHERE email=$1', [email]);
    const admin = rows[0];
    // Perform a hash comparison even for unknown emails to reduce timing leaks.
    const hash = admin?.password_hash || '$2a$12$C6UzMDM.H6dfI/f/IKcEe.9O9L9X.6P5Q4Y3jQyR3Qx4o5m5v5m5m';
    const valid = await bcrypt.compare(parsed.data.password, hash);
    if (!admin || !valid || !admin.active) return res.status(401).json({error:'Invalid email or password.'});
    await new Promise((resolve,reject)=>req.session.regenerate(err=>err?reject(err):resolve()));
    req.session.admin = { id: admin.id, email: admin.email, name: admin.display_name, role: admin.role };
    req.session.csrfToken = (await import('node:crypto')).randomBytes(32).toString('hex');
    await new Promise((resolve,reject)=>req.session.save(err=>err?reject(err):resolve()));
    await pool.query('UPDATE admins SET last_login_at=NOW() WHERE id=$1',[admin.id]);
    res.json({admin:req.session.admin, csrfToken:req.session.csrfToken});
  } catch(e) { next(e); }
});
router.post('/logout', requireAdmin, (req,res,next) => req.session.destroy(err => { if(err) return next(err); res.clearCookie('mg.sid'); res.status(204).end(); }));
export default router;
