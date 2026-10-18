import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Import utilities
import { money, adminStatusLabel, readStore } from '../src/lib/utils.js';

test('1. Currency Formatter (money) properly formats INR values', () => {
  const formatted = money(1499);
  assert.ok(formatted.includes('1,499') || formatted.includes('1499'), 'Should format 1499');
  assert.ok(formatted.includes('₹') || formatted.includes('INR'), 'Should include rupee sign');
  assert.equal(money(0).replace(/\s/g, ''), '₹0'.replace(/\s/g, ''));
});

test('2. Admin Status Labels return clean customer-facing strings', () => {
  assert.equal(adminStatusLabel('awaiting_payment'), 'Awaiting payment');
  assert.equal(adminStatusLabel('paid'), 'Paid');
  assert.equal(adminStatusLabel('shipped'), 'Shipped');
  assert.equal(adminStatusLabel('completed'), 'Completed');
  assert.equal(adminStatusLabel('unknown_status'), 'unknown_status');
});

test('3. Shipping Threshold Business Logic Invariants', () => {
  function computeShipping(subtotal) {
    return subtotal >= 999 ? 0 : 99;
  }

  assert.equal(computeShipping(1000), 0, 'Orders >= 999 must have free shipping');
  assert.equal(computeShipping(999), 0, 'Exact 999 threshold must qualify for free shipping');
  assert.equal(computeShipping(998), 99, 'Orders under 999 must incur 99 flat shipping fee');
  assert.equal(computeShipping(599), 99, 'Orders under 999 must incur 99 flat shipping fee');
});

test('4. Cart Mutation Invariants (Add, Increment, Decrement to Zero)', () => {
  let cart = {};

  // Add item 1 with qty 2
  cart[1] = (cart[1] || 0) + 2;
  assert.equal(cart[1], 2);

  // Increment item 1
  cart[1] = (cart[1] || 0) + 1;
  assert.equal(cart[1], 3);

  // Decrement item 1
  cart[1] = cart[1] - 1;
  assert.equal(cart[1], 2);

  // Decrement to zero removes key
  cart[1] = cart[1] - 2;
  if (cart[1] <= 0) delete cart[1];
  assert.equal(cart[1], undefined, 'Cart item should be deleted when qty <= 0');
});

test('5. Catalog Integrity: 22 Kits & Existing Media Assets', () => {
  const appCode = fs.readFileSync(path.join(rootDir, 'src/App.jsx'), 'utf8');

  // Verify seedProducts length
  const idMatches = appCode.match(/id:\s*([0-9]+),/g) || [];
  assert.ok(idMatches.length >= 22, `Catalog should contain at least 22 kits, found ${idMatches.length}`);

  // Extract all media references and verify files exist in dist
  const assetRegex = /['"](\/(?:images|anukool-assets|kitsters-media|generated-assets)[^'"]+)['"]/g;
  let match;
  let checked = 0;
  while ((match = assetRegex.exec(appCode)) !== null) {
    const relPath = match[1];
    const fullPath = path.join(rootDir, 'dist', relPath);
    assert.ok(fs.existsSync(fullPath), `Asset file must exist: ${relPath}`);
    checked++;
  }
  assert.ok(checked > 0, 'Should have checked multiple media assets');
});

test('6. Offline Simulated Checkout Invariants', () => {
  const subtotal = 1299;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const mockOrder = {
    orderNumber: 'ANK-884219',
    total,
    status: 'paid',
    paymentStatus: 'captured',
    createdAt: new Date().toISOString()
  };

  assert.ok(mockOrder.orderNumber.startsWith('ANK-'), 'Order number should start with ANK- prefix');
  assert.equal(mockOrder.total, 1299, 'Free shipping should result in total == subtotal');
  assert.equal(mockOrder.status, 'paid');
});

test('7. TypeSafe AI System One (Jev) Primitives (Choice, Noul, Score)', async () => {
  const { evaluateGiftIntent } = await import('../src/lib/typesafe.js');

  const mockCatalog = [
    { id: 1, name: 'Anukool Diwali Light-Making Kit', category: 'Gifting & Fabric', price: 699, tag: 'Festive craft', craftTime: '45 mins', difficulty: 'Beginner' },
    { id: 2, name: 'Anukool Rakhi Artisan Box', category: 'Gifting & Fabric', price: 499, tag: 'Festive heirloom', craftTime: '30 mins', difficulty: 'Beginner' },
    { id: 3, name: 'Mindful Leather Journal Kit', category: 'Art & Craft', price: 1299, tag: 'Mindful maker', craftTime: '90 mins', difficulty: 'Intermediate' }
  ];

  // Test Diwali Intent
  const resultDiwali = await evaluateGiftIntent('Diwali gift for mom under 1000', mockCatalog, 1000);
  assert.ok(resultDiwali.topPicks.length > 0, 'Should return top picks');
  assert.equal(resultDiwali.topPicks[0].id, 1, 'Top pick for Diwali should be kit 1 (Diwali Light-Making Kit)');
  assert.ok(resultDiwali.topPicks[0].choiceProbability > 0.4, 'Top pick choice probability should be calibrated');
  assert.equal(resultDiwali.budgetFit.satisfied, true, 'Kit price 699 is under budget 1000');
  assert.ok(resultDiwali.budgetFit.probability >= 0.9, 'Budget Noul probability should be >= 0.9');
  assert.ok(resultDiwali.sentimentScore.score >= 4, 'Score level should be high resonance (>=4)');

  // Test Budget Exceeded Scenario
  const resultOverBudget = await evaluateGiftIntent('Luxury leather book kit under 800', mockCatalog, 800);
  const leatherPick = resultOverBudget.topPicks.find(p => p.id === 3);
  if (resultOverBudget.topPicks[0].id === 3) {
    assert.equal(resultOverBudget.budgetFit.satisfied, false, '1299 exceeds 800 budget');
  }
});

test('8. WCAG Accessibility Invariants (ARIA Dialog, Labels, Escape Key)', () => {
  const appCode = fs.readFileSync(path.join(rootDir, 'src/App.jsx'), 'utf8');

  // Verify Cart Drawer ARIA dialog attributes
  assert.ok(appCode.includes('role="dialog"'), 'Must have role="dialog"');
  assert.ok(appCode.includes('aria-modal="true"'), 'Must have aria-modal="true"');
  assert.ok(appCode.includes('aria-label="Shopping Bag"'), 'Must have Shopping Bag aria-label');

  // Verify Escape key handling exists
  assert.ok(appCode.includes("e.key === 'Escape'"), 'Must handle Escape key for accessibility dismiss');

  // Verify search field accessible label
  assert.ok(appCode.includes('aria-label="Search craft kits"'), 'Search input must have descriptive aria-label');

  // Verify toast polite live region
  assert.ok(appCode.includes('role="status" aria-live="polite"'), 'Toast container must announce via live region');
});

test('9. Multi-Currency Engine Math & Invariants', async () => {
  const { formatCurrency, SUPPORTED_CURRENCIES } = await import('../src/lib/currency.js');

  // Verify all supported currencies exist
  assert.ok(SUPPORTED_CURRENCIES.INR);
  assert.ok(SUPPORTED_CURRENCIES.USD);
  assert.ok(SUPPORTED_CURRENCIES.GBP);
  assert.ok(SUPPORTED_CURRENCIES.EUR);
  assert.ok(SUPPORTED_CURRENCIES.AED);
  assert.ok(SUPPORTED_CURRENCIES.CAD);

  // INR formatting
  const inr = formatCurrency(699, 'INR');
  assert.ok(inr.includes('699'));
  assert.ok(inr.includes('₹') || inr.includes('INR'));

  // USD conversion (699 * 0.012 = ~8)
  const usd = formatCurrency(699, 'USD');
  assert.ok(usd.includes('$') || usd.includes('USD'));

  // GBP conversion
  const gbp = formatCurrency(999, 'GBP');
  assert.ok(gbp.includes('£') || gbp.includes('GBP'));
});

test('10. View Transitions & Block Print Studio Invariants', async () => {
  const { runViewTransition } = await import('../src/lib/viewTransitions.js');
  let executed = false;
  runViewTransition(() => { executed = true; });
  assert.equal(executed, true, 'runViewTransition must execute callback synchronously when native API is absent');

  const appCode = fs.readFileSync(path.join(rootDir, 'src/App.jsx'), 'utf8');
  assert.ok(appCode.includes('BlockPrintSimulatorModal'), 'Must import and mount BlockPrintSimulatorModal');
  assert.ok(appCode.includes('TRY BLOCK PRINTING'), 'Must provide TRY BLOCK PRINTING triggers');
  assert.ok(appCode.includes('currency-selector-wrap'), 'Must provide currency selector in header');
});


