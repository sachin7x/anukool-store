import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Import Agentic Modules
import { MASTER_CATALOG, formatProductForAI } from '../src/lib/productTailoring.js';
import {
  searchKits,
  getKitDetails,
  estimateShipping,
  generateMockPaymentToken,
  validatePaymentToken,
  createAgenticOrder
} from '../src/lib/agenticCommerce.js';

test('1. Agentic Discovery Manifest (.well-known/ai-commerce.json) Validation', () => {
  const manifestPath = path.join(rootDir, 'public', '.well-known', 'ai-commerce.json');
  assert.ok(fs.existsSync(manifestPath), 'Manifest file must exist in public/.well-known/');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.protocol, 'agentic-commerce/v1');
  assert.equal(manifest.merchant.sellerName, 'Anukool (अनुकूल) — Crafted for Connection');
  assert.equal(manifest.merchant.parentEntity, 'M/s V K Enterprises, Jaipur');
  assert.ok(manifest.merchant.sellerStoreUrl);
  assert.ok(manifest.merchant.sellerTermsOfServiceUrl);
  assert.ok(manifest.merchant.sellerPrivacyPolicyUrl);
  assert.equal(manifest.catalog.productCount, 22);
  assert.deepEqual(manifest.catalog.supportedCurrencies, ['INR', 'USD', 'GBP', 'EUR', 'AED', 'CAD']);
  assert.equal(manifest.securityAndPayment.merchantOfRecord, true);
  assert.equal(manifest.agentInterface.tools.length, 4);
});

test('2. llms.txt Discovery Standard Compliance', () => {
  const llmsPath = path.join(rootDir, 'public', 'llms.txt');
  assert.ok(fs.existsSync(llmsPath), 'llms.txt must exist in public root');

  const content = fs.readFileSync(llmsPath, 'utf8');
  assert.ok(content.includes('Anukool (अनुकूल) — Crafted for Connection'));
  assert.ok(content.includes('V K Enterprises, Jaipur'));
  assert.ok(content.includes('ANK-BP-001'));
  assert.ok(content.includes('ANK-FD-022'));
  assert.ok(content.includes('.well-known/ai-commerce.json'));
});

test('3. Product Tailoring: 22 Kits GTIN-13, SKU & Attribute Invariants', () => {
  assert.equal(MASTER_CATALOG.length, 22, 'Master catalog must contain exactly 22 authentic kits');

  for (const item of MASTER_CATALOG) {
    assert.ok(/^ANK-[A-Z]{2}-\d{3}$/.test(item.sku), `Invalid SKU: ${item.sku}`);
    assert.ok(/^\d{13}$/.test(item.gtin), `Invalid GTIN-13: ${item.gtin}`);
    assert.equal(item.brand, 'Anukool');
    assert.equal(item.availability, 'in_stock');
    assert.ok(item.tailoredTitle.length >= 15);
    assert.ok(item.tailoredDescription.length >= 30);
    assert.ok(item.price > 0);
    assert.ok(item.mrp >= item.price);
    assert.ok(item.returnWindowDays >= 7);

    // Verify media asset exists on disk in public or dist
    const pubImg = path.join(rootDir, 'public', item.image);
    const distImg = path.join(rootDir, 'dist', item.image);
    assert.ok(fs.existsSync(pubImg) || fs.existsSync(distImg), `Image must exist on disk: ${item.image}`);
  }
});

test('4. Semantic Search & Multi-Currency Agentic Discovery', () => {
  // Discovery by Occasion (Diwali)
  const diwali = searchKits({ occasion: 'Diwali', currency: 'INR' });
  assert.ok(diwali.totalFound >= 1);
  assert.equal(diwali.products[0].sku, 'ANK-BP-001');

  // Discovery by Budget constraint in USD
  const under10Usd = searchKits({ maxPrice: 10, currency: 'USD' });
  assert.ok(under10Usd.totalFound > 0);
  for (const p of under10Usd.products) {
    assert.ok(p.price <= 10, `Product price ${p.price} should be <= $10 USD`);
    assert.equal(p.currency, 'USD');
  }

  // Discovery by Category
  const foodKits = searchKits({ category: 'Food' });
  assert.equal(foodKits.totalFound, 2, 'Should find Cotton Candy and Ice Gola kits');
});

test('5. Tailored Kit Details Retrieval (formatProductForAI)', () => {
  const kit1 = getKitDetails('ANK-BP-001', 'INR');
  assert.equal(kit1.success, true);
  assert.equal(kit1.product.sku, 'ANK-BP-001');
  assert.ok(kit1.product.materials.includes('Cotton'));
  assert.ok(kit1.product.narrative.includes('Jaipur'));

  const unknown = getKitDetails('NON-EXISTENT-SKU');
  assert.equal(unknown.error, 'PRODUCT_NOT_FOUND');
});

test('6. Shipping Calculation & Zone Carrier SLA Rules', () => {
  // Jaipur local PIN code (302001) under threshold
  const jaipurLocal = estimateShipping({ postalCode: '302001', subtotal: 500, currency: 'INR' });
  assert.equal(jaipurLocal.isFreeShipping, false);
  assert.equal(jaipurLocal.shippingFee, 99);
  assert.equal(jaipurLocal.gapToFreeShipping, 499);
  assert.equal(jaipurLocal.carrier, 'Jaipur Artisan Express');

  // Metro PIN code (110001) above 999 threshold
  const metroOrder = estimateShipping({ postalCode: '110001', subtotal: 1499, currency: 'INR' });
  assert.equal(metroOrder.isFreeShipping, true);
  assert.equal(metroOrder.shippingFee, 0);
  assert.equal(metroOrder.formattedShipping, 'FREE');
  assert.ok(metroOrder.estimatedDeliveryTime.includes('Metro Express'));
});

test('7. Single-Use Amount-Constrained Payment Token Verification', () => {
  const token = generateMockPaymentToken({ amount: 1598, currency: 'INR', ttlSeconds: 300 });

  // Valid token
  const validCheck = validatePaymentToken(token, 1598, 'INR');
  assert.equal(validCheck.valid, true);
  assert.equal(validCheck.authorizedAmount, 1598);

  // Amount mismatch
  const badAmount = validatePaymentToken(token, 999, 'INR');
  assert.equal(badAmount.valid, false);
  assert.ok(badAmount.reason.includes('AMOUNT_MISMATCH'));

  // Currency mismatch
  const badCurrency = validatePaymentToken(token, 1598, 'USD');
  assert.equal(badCurrency.valid, false);
  assert.ok(badCurrency.reason.includes('CURRENCY_MISMATCH'));
});

test('8. End-to-End Agentic Checkout & Replay Attack Defense', () => {
  const item = MASTER_CATALOG[0]; // Price 699
  const subtotal = item.price;
  const shipping = 99; // < 999 threshold
  const total = subtotal + shipping; // 798

  const token = generateMockPaymentToken({ amount: total, currency: 'INR', ttlSeconds: 600 });

  const orderResult = createAgenticOrder({
    items: [{ id: item.id, quantity: 1 }],
    shippingAddress: {
      name: 'Dr. Siddharth Sen',
      email: 'siddharth@example.org',
      address: 'Malviya Nagar',
      city: 'Jaipur',
      postalCode: '302017'
    },
    currency: 'INR',
    paymentToken: token
  });

  assert.equal(orderResult.success, true);
  assert.ok(orderResult.order.orderNumber.startsWith('ANK-'));
  assert.equal(orderResult.order.total, total);
  assert.equal(orderResult.order.status, 'paid');
  assert.equal(orderResult.order.channel, 'agentic_commerce');

  // Attempt replay attack with the same consumed token
  const replayAttempt = createAgenticOrder({
    items: [{ id: item.id, quantity: 1 }],
    shippingAddress: {
      name: 'Hacker',
      email: 'bad@actor.com',
      address: 'Nowhere',
      city: 'Delhi',
      postalCode: '110001'
    },
    currency: 'INR',
    paymentToken: token
  });

  assert.equal(replayAttempt.success, false);
  assert.equal(replayAttempt.error, 'PAYMENT_AUTHORIZATION_FAILED');
  assert.equal(replayAttempt.reason, 'TOKEN_ALREADY_CONSUMED_REPLAY_ATTACK');
});

test('9. Automated Agentic Feed Compliance Script Execution', async () => {
  const { validateFeed } = await import('../scripts/validate_agentic_feed.cjs');
  const feedPass = await validateFeed();
  assert.equal(feedPass, true, 'All 22 items must pass feed compliance');
});
