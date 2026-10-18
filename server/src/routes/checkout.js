import { Router } from 'express';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { z } from 'zod';
import { pool } from '../lib/db.js';
import { safeOrder } from '../middleware/security.js';
const router = Router();
const checkoutSchema = z.object({ items:z.array(z.object({productId:z.coerce.number().int().positive(),quantity:z.coerce.number().int().min(1).max(20)})).min(1).max(50), customer:z.object({name:z.string().trim().min(2).max(120),email:z.string().email().max(254),phone:z.string().trim().min(8).max(20),addressLine1:z.string().trim().min(3).max(200),addressLine2:z.string().max(200).optional().default(''),city:z.string().trim().min(2).max(100),state:z.string().trim().min(2).max(100),postalCode:z.string().trim().min(4).max(12),country:z.string().trim().min(2).max(80).default('India')}) });
function razorpay(){if(!process.env.RAZORPAY_KEY_ID||!process.env.RAZORPAY_KEY_SECRET)throw new Error('Razorpay credentials are not configured.');return new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});}
router.post('/create-order', async(req,res,next)=>{
 const parsed=checkoutSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Check the checkout details.',details:parsed.error.flatten()});
 const client=await pool.connect();let order;
 try {
  await client.query('BEGIN');
  const quantities=new Map();for(const item of parsed.data.items)quantities.set(item.productId,(quantities.get(item.productId)||0)+item.quantity);
  const ids=[...quantities.keys()];const {rows:products}=await client.query('SELECT * FROM products WHERE id=ANY($1::bigint[]) AND active=TRUE ORDER BY id FOR UPDATE',[ids]);
  if(products.length!==ids.length){await client.query('ROLLBACK');return res.status(400).json({error:'One or more products are no longer available.'});}
  let subtotal=0;const items=[];
  for(const p of products){const quantity=quantities.get(Number(p.id));if(p.stock<quantity){await client.query('ROLLBACK');return res.status(409).json({error:`Not enough stock for ${p.name}.`});}const line=p.price_paise*quantity;subtotal+=line;items.push({productId:Number(p.id),name:p.name,pricePaise:p.price_paise,quantity,lineTotal:line});}
  const shipping=subtotal>=99900?0:9900;const total=subtotal+shipping;if(total<=0||total>500000000){await client.query('ROLLBACK');return res.status(400).json({error:'Order total is outside allowed limits.'});}
  const orderNumber=`MG-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  const address={addressLine1:parsed.data.customer.addressLine1,addressLine2:parsed.data.customer.addressLine2,city:parsed.data.customer.city,state:parsed.data.customer.state,postalCode:parsed.data.customer.postalCode,country:parsed.data.customer.country};
  const inserted=await client.query(`INSERT INTO orders(order_number,customer_name,customer_email,customer_phone,shipping_address,subtotal_paise,shipping_paise,total_paise) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,[orderNumber,parsed.data.customer.name,parsed.data.customer.email.toLowerCase(),parsed.data.customer.phone,address,subtotal,shipping,total]);order=inserted.rows[0];
  for(const item of items){await client.query('INSERT INTO order_items(order_id,product_id,product_name,unit_price_paise,quantity,line_total_paise) VALUES($1,$2,$3,$4,$5,$6)',[order.id,item.productId,item.name,item.pricePaise,item.quantity,item.lineTotal]);await client.query('UPDATE products SET stock=stock-$1,updated_at=NOW() WHERE id=$2',[item.quantity,item.productId]);}
  await client.query('COMMIT');
 }catch(e){await client.query('ROLLBACK').catch(()=>{});return next(e);}finally{client.release();}
 try {
  const rp=await razorpay().orders.create({amount:order.total_paise,currency:'INR',receipt:order.order_number,notes:{internal_order_id:order.id,order_number:order.order_number}});
  await pool.query('UPDATE orders SET razorpay_order_id=$1,updated_at=NOW() WHERE id=$2',[rp.id,order.id]);
  res.status(201).json({orderId:order.id,orderNumber:order.order_number,amount:order.total_paise,currency:'INR',razorpayOrderId:rp.id,keyId:process.env.RAZORPAY_KEY_ID,customer:{name:order.customer_name,email:order.customer_email,phone:order.customer_phone}});
 }catch(e){await releaseStockAndFail(order.id,'payment_failed');next(e);}
});
router.post('/verify-payment',async(req,res,next)=>{
 const schema=z.object({orderId:z.string().uuid(),razorpay_order_id:z.string().min(1),razorpay_payment_id:z.string().min(1),razorpay_signature:z.string().regex(/^[a-f0-9]{64}$/i)});const p=schema.safeParse(req.body);if(!p.success)return res.status(400).json({error:'Invalid payment verification payload.'});
 try {const {orderId,razorpay_order_id,razorpay_payment_id,razorpay_signature}=p.data;const {rows}=await pool.query('SELECT * FROM orders WHERE id=$1',[orderId]);const order=rows[0];if(!order||order.razorpay_order_id!==razorpay_order_id)return res.status(400).json({error:'Order does not match this payment.'});const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');const a=Buffer.from(expected,'hex'),b=Buffer.from(razorpay_signature,'hex');if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(400).json({error:'Payment signature verification failed.'});await pool.query(`UPDATE orders SET payment_status='authorized',status=CASE WHEN status='awaiting_payment' THEN 'paid' ELSE status END,razorpay_payment_id=$1,updated_at=NOW() WHERE id=$2 AND payment_status IN ('created','authorized','captured')`,[razorpay_payment_id,orderId]);res.json({verified:true,orderNumber:order.order_number});}catch(e){next(e);}
});
async function releaseStockAndFail(orderId,status){const client=await pool.connect();try{await client.query('BEGIN');const r=await client.query('SELECT * FROM orders WHERE id=$1 FOR UPDATE',[orderId]);const o=r.rows[0];if(o&&!o.stock_released&&['awaiting_payment','payment_failed'].includes(o.status)){const items=await client.query('SELECT product_id,quantity FROM order_items WHERE order_id=$1',[orderId]);for(const i of items.rows)if(i.product_id)await client.query('UPDATE products SET stock=stock+$1,updated_at=NOW() WHERE id=$2',[i.quantity,i.product_id]);await client.query('UPDATE orders SET status=$1,payment_status=$2,stock_released=TRUE,updated_at=NOW() WHERE id=$3',[status,'failed',orderId]);}await client.query('COMMIT');}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}}
export async function handleRazorpayWebhook(req,res){
 const secret=process.env.RAZORPAY_WEBHOOK_SECRET;if(!secret)return res.status(503).json({error:'Webhook secret is not configured.'});const signature=req.get('x-razorpay-signature');if(!signature)return res.status(400).json({error:'Missing webhook signature.'});const expected=crypto.createHmac('sha256',secret).update(req.body).digest('hex');const a=Buffer.from(expected,'hex'),b=Buffer.from(signature,'hex');if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(400).json({error:'Invalid webhook signature.'});
 try {const event=JSON.parse(req.body.toString('utf8'));const eventId=req.get('x-razorpay-event-id')||crypto.createHash('sha256').update(req.body).digest('hex');const already=await pool.query('SELECT 1 FROM razorpay_webhook_events WHERE event_id=$1',[eventId]);if(already.rowCount)return res.status(200).json({received:true,duplicate:true});const entity=event.payload?.payment?.entity;const rpOrderId=entity?.order_id;
  if(event.event==='payment.captured'&&rpOrderId){await pool.query(`UPDATE orders SET payment_status='captured',status=CASE WHEN status='awaiting_payment' OR status='paid' THEN 'processing' ELSE status END,razorpay_payment_id=COALESCE(razorpay_payment_id,$1),updated_at=NOW() WHERE razorpay_order_id=$2`,[entity.id,rpOrderId]);}
  if(event.event==='payment.failed'&&rpOrderId){const r=await pool.query('SELECT id FROM orders WHERE razorpay_order_id=$1',[rpOrderId]);if(r.rows[0])await releaseStockAndFail(r.rows[0].id,'payment_failed');}
  if(event.event==='refund.processed'&&entity?.id){await pool.query(`UPDATE orders SET payment_status='refunded',status='refunded',updated_at=NOW() WHERE razorpay_payment_id=$1`,[entity.id]);}
  await pool.query('INSERT INTO razorpay_webhook_events(event_id,event_type) VALUES($1,$2) ON CONFLICT DO NOTHING',[eventId,event.event]);
  res.status(200).json({received:true});
 }catch(e){console.error('Razorpay webhook processing failed',e);res.status(500).json({error:'Webhook processing failed.'});}
}
export default router;
