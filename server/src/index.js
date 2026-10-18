import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import rateLimit from 'express-rate-limit';
import { pool } from './lib/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import checkoutRoutes, { handleRazorpayWebhook } from './routes/checkout.js';
import orderRoutes from './routes/orders.js';
import { csrfToken, verifyCsrf } from './middleware/security.js';

const app=express();const isProduction=process.env.NODE_ENV==='production';
if(!process.env.SESSION_SECRET||process.env.SESSION_SECRET.length<32)throw new Error('SESSION_SECRET must be at least 32 characters.');
const origins=(process.env.FRONTEND_ORIGIN||'http://localhost:5173').split(',').map(s=>s.trim()).filter(Boolean);
app.disable('x-powered-by');if(isProduction)app.set('trust proxy',1);
app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}));
app.use(cors({origin(origin,cb){if(!origin||origins.includes(origin))return cb(null,true);return cb(new Error('Origin not allowed by CORS.'));},credentials:true,methods:['GET','POST','PATCH','DELETE','OPTIONS'],allowedHeaders:['Content-Type','X-CSRF-Token']}));
// Razorpay needs the unmodified bytes to validate its HMAC signature.
app.post('/api/payments/razorpay-webhook',express.raw({type:'application/json',limit:'1mb'}),handleRazorpayWebhook);
app.use(express.json({limit:'100kb'}));
const PgStore=connectPgSimple(session);
app.use(session({name:'mg.sid',store:new PgStore({pool,tableName:'user_sessions',createTableIfMissing:true}),secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:false,rolling:true,cookie:{httpOnly:true,secure:isProduction,sameSite:'strict',maxAge:8*60*60*1000,path:'/'}}));
app.use('/api',rateLimit({windowMs:15*60*1000,limit:300,standardHeaders:'draft-7',legacyHeaders:false}));
app.get('/api/health',async(req,res)=>{try{await pool.query('SELECT 1');res.json({ok:true,service:'makegood-api'});}catch{res.status(503).json({ok:false});}});
app.get('/api/csrf',csrfToken);
app.use('/api',verifyCsrf);
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:10,skipSuccessfulRequests:true,standardHeaders:'draft-7',legacyHeaders:false}));
app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/checkout',checkoutRoutes);
app.use('/api/admin/orders',orderRoutes);
app.use((req,res)=>res.status(404).json({error:'Not found.'}));
app.use((err,req,res,next)=>{console.error(err);if(res.headersSent)return next(err);const status=err.status||500;res.status(status).json({error:status>=500?'Internal server error.':err.message||'Request failed.'});});
const port=Number(process.env.PORT||4000);const server=app.listen(port,()=>console.log(`MakeGood API listening on :${port}`));
async function shutdown(){server.close(async()=>{await pool.end();process.exit(0);});setTimeout(()=>process.exit(1),10000).unref();}
process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
