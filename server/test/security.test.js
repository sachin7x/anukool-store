import test from 'node:test';
import assert from 'node:assert/strict';
import { safeProduct, safeOrder, slugify } from '../src/middleware/security.js';

test('slugify normalizes punctuation and diacritics', () => {
  assert.equal(slugify('Crème brûlée — DIY Kit!'), 'creme-brulee-diy-kit');
  assert.equal(slugify('!!!'), 'product');
});

test('safeProduct maps database paise to rupees and numeric ids', () => {
  const product = safeProduct({
    id: '42', name: 'Mini Kit', slug: 'mini-kit', category: 'Craft', description: 'A kit',
    price_paise: 129900, stock: 8, rating: '4.8', emoji: '🎨', color: '#f7d9d4', tag: 'New', active: true,
  });
  assert.equal(product.id, 42);
  assert.equal(product.price, 1299);
  assert.equal(product.rating, 4.8);
  assert.equal(product.active, true);
});

test('safeOrder omits raw payment secrets and converts totals', () => {
  const order = safeOrder({
    id: 'order-uuid', order_number: 'MG-TEST', status: 'paid', payment_status: 'authorized',
    customer_name: 'Maker', customer_email: 'maker@example.com', customer_phone: '1234567890',
    shipping_address: { city: 'Jaipur' }, subtotal_paise: 100000, shipping_paise: 0,
    total_paise: 100000, currency: 'INR', created_at: new Date('2026-01-01T00:00:00Z'),
    razorpay_payment_id: 'pay_test_123', razorpay_key_secret: 'must-not-escape',
  }, []);
  assert.equal(order.total, 1000);
  assert.equal(order.orderNumber, 'MG-TEST');
  assert.equal('razorpay_key_secret' in order, false);
});
