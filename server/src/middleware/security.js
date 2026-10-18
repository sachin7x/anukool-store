import crypto from 'node:crypto';
export function requireAdmin(req, res, next) {
  if (!req.session?.admin) return res.status(401).json({ error: 'Authentication required.' });
  next();
}
export function csrfToken(req, res, next) {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  res.json({ csrfToken: req.session.csrfToken });
}
export function verifyCsrf(req, res, next) {
  if (['GET','HEAD','OPTIONS'].includes(req.method)) return next();
  const token = req.get('x-csrf-token');
  const expected = req.session?.csrfToken;
  if (!token || !expected || token.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) return res.status(403).json({ error: 'Invalid CSRF token.' });
  next();
}
export function slugify(value) { return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80) || 'product'; }
export function safeProduct(row) { return { id: Number(row.id), name: row.name, slug: row.slug, category: row.category, description: row.description, price: row.price_paise / 100, stock: row.stock, rating: Number(row.rating), emoji: row.emoji, color: row.color, tag: row.tag, active: row.active }; }
export function safeOrder(row, items = []) { return { id: row.id, orderNumber: row.order_number, status: row.status, paymentStatus: row.payment_status, customerName: row.customer_name, customerEmail: row.customer_email, customerPhone: row.customer_phone, shippingAddress: row.shipping_address, items, subtotal: row.subtotal_paise / 100, shipping: row.shipping_paise / 100, total: row.total_paise / 100, currency: row.currency, createdAt: row.created_at, razorpayPaymentId: row.razorpay_payment_id }; }
