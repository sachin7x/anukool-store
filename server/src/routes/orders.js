import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../lib/db.js';
import { requireAdmin, safeOrder } from '../middleware/security.js';

const router = Router();
router.use(requireAdmin);

async function getItems(orderId, db = pool) {
  const { rows } = await db.query(
    'SELECT product_id,product_name,unit_price_paise,quantity,line_total_paise FROM order_items WHERE order_id=$1 ORDER BY id',
    [orderId],
  );
  return rows.map(item => ({
    productId: item.product_id === null ? null : Number(item.product_id),
    name: item.product_name,
    price: item.unit_price_paise / 100,
    qty: item.quantity,
    lineTotal: item.line_total_paise / 100,
  }));
}

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500');
    const orders = await Promise.all(rows.map(async order => safeOrder(order, await getItems(order.id))));
    res.json({ orders });
  } catch (error) { next(error); }
});

router.get('/summary', async (req, res, next) => {
  try {
    const [orders, products, revenue] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM orders'),
      pool.query('SELECT COUNT(*)::int AS count,COALESCE(SUM(stock),0)::int AS units FROM products WHERE active=TRUE'),
      pool.query("SELECT COALESCE(SUM(total_paise),0)::bigint AS amount FROM orders WHERE payment_status='captured'"),
    ]);
    res.json({
      orders: orders.rows[0].count,
      products: products.rows[0].count,
      unitsInStock: products.rows[0].units,
      revenue: Number(revenue.rows[0].amount) / 100,
    });
  } catch (error) { next(error); }
});

router.patch('/:id/status', async (req, res, next) => {
  const parsed = z.object({ status: z.enum(['processing', 'shipped', 'completed', 'cancelled', 'refunded']) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid order status.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT * FROM orders WHERE id=$1 FOR UPDATE', [req.params.id]);
    const order = rows[0];
    if (!order) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found.' });
    }
    if (parsed.data.status === 'cancelled' && ['captured', 'authorized'].includes(order.payment_status)) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Paid or authorized orders must be refunded or voided through Razorpay before cancellation.' });
    }
    if (parsed.data.status === 'refunded') {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Issue and verify the refund with Razorpay before marking an order refunded.' });
    }
    if (parsed.data.status !== 'cancelled' && !['captured', 'authorized'].includes(order.payment_status)) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Only paid orders can be processed, shipped or completed.' });
    }
    if (parsed.data.status === 'cancelled' && !order.stock_released) {
      const { rows: items } = await client.query('SELECT product_id,quantity FROM order_items WHERE order_id=$1', [order.id]);
      for (const item of items) {
        if (item.product_id !== null) {
          await client.query('UPDATE products SET stock=stock+$1,updated_at=NOW() WHERE id=$2', [item.quantity, item.product_id]);
        }
      }
    }
    const nextPaymentStatus = parsed.data.status === 'cancelled' && order.payment_status === 'created' ? 'failed' : order.payment_status;
    const releaseStock = parsed.data.status === 'cancelled' ? true : order.stock_released;
    const { rows: updatedRows } = await client.query(
      'UPDATE orders SET status=$1,payment_status=$2,stock_released=$3,updated_at=NOW() WHERE id=$4 RETURNING *',
      [parsed.data.status, nextPaymentStatus, releaseStock, req.params.id],
    );
    await client.query('COMMIT');
    const updated = updatedRows[0];
    res.json({ order: safeOrder(updated, await getItems(updated.id)) });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    next(error);
  } finally { client.release(); }
});

export default router;
