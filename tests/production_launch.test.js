import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildUpiUrl, generateUpiQrSvg, DEFAULT_VPA, DEFAULT_MERCHANT_NAME } from '../src/lib/paymentEngine.js';
import {
  generateConsignmentRecord,
  buildWhatsAppDispatchUrl,
  calculateGstBreakdown,
  VK_ENTERPRISES_GSTIN,
  VK_ENTERPRISES_ADDRESS,
  CARRIERS
} from '../src/lib/dispatchEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Phase A: PWA Manifest & Service Worker Compliance', () => {
  // 1. Verify manifest.webmanifest exists and is valid JSON
  const manifestPath = path.join(rootDir, 'public', 'manifest.webmanifest');
  assert.ok(fs.existsSync(manifestPath), 'manifest.webmanifest must exist in public/');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.name, 'Anukool — Crafted for Connection');
  assert.equal(manifest.short_name, 'Anukool');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.theme_color, '#2E3A8A');
  assert.equal(manifest.background_color, '#F8F4E9');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'Must have at least 192x192 and 512x512 icons');

  // 2. Verify service worker exists
  const swPath = path.join(rootDir, 'public', 'sw.js');
  assert.ok(fs.existsSync(swPath), 'sw.js must exist in public/');
  const swContent = fs.readFileSync(swPath, 'utf8');
  assert.ok(swContent.includes('anukool-v1'), 'Service worker must specify cache version');
  assert.ok(swContent.includes('addEventListener(\'fetch\''), 'Service worker must intercept fetch requests');

  // 3. Verify index.html links to manifest and registers sw
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('manifest.webmanifest'), 'index.html must reference manifest.webmanifest');
  assert.ok(indexHtml.includes('serviceWorker.register'), 'index.html must register service worker');
  assert.ok(indexHtml.includes('theme-color'), 'index.html must specify theme-color');
});

test('Phase B: NPCI UPI Deep-Linking & Vector QR Code Generation', async () => {
  // 1. UPI URL Generation
  const upiUrl = buildUpiUrl({
    pa: 'anukool.jaipur@upi',
    pn: 'Anukool Jaipur',
    amount: 1498,
    orderId: 'ANK-782910',
    note: 'Jaipur Block Print Kits'
  });

  assert.ok(upiUrl.startsWith('upi://pay?'), 'Must start with upi://pay? scheme');
  assert.ok(upiUrl.includes('pa=anukool.jaipur%40upi') || upiUrl.includes('pa=anukool.jaipur@upi'), 'Must include correct VPA');
  assert.ok(upiUrl.includes('am=1498.00'), 'Must format amount to 2 decimal places');
  assert.ok(upiUrl.includes('cu=INR'), 'Must specify INR currency');

  // 2. Default constants
  assert.equal(DEFAULT_VPA, 'anukool.jaipur@upi');
  assert.equal(DEFAULT_MERCHANT_NAME, 'Anukool VK Enterprises');

  // 3. Vector SVG QR Code generation
  const svg = await generateUpiQrSvg(upiUrl);
  assert.ok(typeof svg === 'string', 'generateUpiQrSvg must return string');
  assert.ok(svg.includes('<svg') && svg.includes('</svg>'), 'Must produce valid SVG markup');
  assert.ok(svg.includes('#2E3A8A'), 'QR code must render in Anukool Jaipur Indigo (#2E3A8A)');
});

test('Phase C: Logistics Consignment & Courier Tracking Invariants', () => {
  // 1. Metro destination routing (e.g. 110001 New Delhi or 400001 Mumbai) -> BlueDart Express
  const metroConsignment = generateConsignmentRecord('ANK-100200', '110001');
  assert.equal(metroConsignment.orderId, 'ANK-100200');
  assert.equal(metroConsignment.carrier, 'BlueDart Express');
  assert.ok(metroConsignment.awb.startsWith('BD'), 'BlueDart AWB must start with BD');
  assert.ok(metroConsignment.trackingUrl.includes('bluedart.com/tracking/'), 'Must link to BlueDart tracking');
  assert.ok(metroConsignment.origin.includes('V K Enterprises'), 'Origin must cite V K Enterprises');

  // 2. Non-metro destination routing -> Delhivery Air
  const nonMetroConsignment = generateConsignmentRecord('ANK-300400', '342001');
  assert.equal(nonMetroConsignment.carrier, 'Delhivery Air');
  assert.ok(nonMetroConsignment.awb.startsWith('DL'), 'Delhivery AWB must start with DL');
  assert.ok(nonMetroConsignment.trackingUrl.includes('delhivery.com/track/package/'), 'Must link to Delhivery tracking');

  // 3. Carriers table integrity
  assert.equal(CARRIERS.length, 3);
  assert.ok(CARRIERS.some(c => c.id === 'delhivery'));
  assert.ok(CARRIERS.some(c => c.id === 'bluedart'));
});

test('Phase C: WhatsApp Automated Dispatch Notification Generation', () => {
  const waUrl = buildWhatsAppDispatchUrl({
    customerName: 'Aarav Mehta',
    customerPhone: '9876543210',
    orderId: 'ANK-991122',
    awb: 'BD88291024',
    carrier: 'BlueDart Express',
    kitName: 'Diwali Light-Making Kit',
    estimatedDelivery: '3 business days'
  });

  assert.ok(waUrl.startsWith('https://wa.me/919876543210?text='), 'Must prefix phone with 91 country code and query param');
  const decodedText = decodeURIComponent(waUrl.split('?text=')[1]);
  assert.ok(decodedText.includes('Namaste Aarav Mehta! 🪔'), 'Must include cordial Indian greeting');
  assert.ok(decodedText.includes('V K Enterprises, Jaipur'), 'Must reference V K Enterprises Jaipur workshop');
  assert.ok(decodedText.includes('BD88291024'), 'Must include AWB tracking number');
  assert.ok(decodedText.includes('Diwali Light-Making Kit'), 'Must include kit name');
  assert.ok(decodedText.includes('hello@anukool.in'), 'Must include support email');
});

test('Phase C: Indian GST Commerce & Tax Breakdown Invariants', () => {
  // Constant verification
  assert.equal(VK_ENTERPRISES_GSTIN, '08AABCV1234F1Z8');
  assert.ok(VK_ENTERPRISES_ADDRESS.includes('Sanganer, Jaipur, Rajasthan'));

  // 1. Intra-State (Rajasthan -> Rajasthan): CGST (2.5%) + SGST (2.5%)
  const intraTax = calculateGstBreakdown(1050, 'Rajasthan');
  assert.equal(intraTax.isIntraState, true);
  assert.equal(intraTax.ratePercent, 5);
  assert.equal(intraTax.totalTax, 50);
  assert.equal(intraTax.taxableValue, 1000);
  assert.equal(intraTax.cgst, 25);
  assert.equal(intraTax.sgst, 25);
  assert.equal(intraTax.igst, 0);
  assert.equal(intraTax.hsnCode, '5208');

  // 2. Inter-State (Rajasthan -> Maharashtra): IGST (5%)
  const interTax = calculateGstBreakdown(2100, 'Maharashtra');
  assert.equal(interTax.isIntraState, false);
  assert.equal(interTax.ratePercent, 5);
  assert.equal(interTax.totalTax, 100);
  assert.equal(interTax.taxableValue, 2000);
  assert.equal(interTax.cgst, 0);
  assert.equal(interTax.sgst, 0);
  assert.equal(interTax.igst, 100);
});

test('Phase D: Customer Reviews & UGC Architecture Invariants', () => {
  const reviewModalPath = path.join(rootDir, 'src', 'components', 'ReviewModal.jsx');
  assert.ok(fs.existsSync(reviewModalPath), 'ReviewModal.jsx must exist');
  const reviewModalContent = fs.readFileSync(reviewModalPath, 'utf8');

  // Invariants
  assert.ok(reviewModalContent.includes('ank_reviews'), 'Must persist to ank_reviews localStorage key');
  assert.ok(reviewModalContent.includes('handlePhotoSelect'), 'Must support photo upload via FileReader');
  assert.ok(reviewModalContent.includes('craftExperience'), 'Must include craft experience metadata');
  assert.ok(reviewModalContent.includes('verified: true'), 'Reviews must carry verified status');

  // ProductPage integration
  const productPageContent = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'ProductPage.jsx'), 'utf8');
  assert.ok(productPageContent.includes('ReviewModal'), 'ProductPage must import ReviewModal');
  assert.ok(productPageContent.includes('+ WRITE A REVIEW'), 'ProductPage must have Write a Review button');
  assert.ok(productPageContent.includes('reviewsList.map'), 'ProductPage must render user submitted reviews');
});

test('Phase E: Cloudflare Pages & Deployment Invariants', () => {
  const wranglerPath = path.join(rootDir, 'wrangler.toml');
  assert.ok(fs.existsSync(wranglerPath), 'wrangler.toml must exist');
  const wranglerContent = fs.readFileSync(wranglerPath, 'utf8');
  assert.ok(wranglerContent.includes('pages_build_output_dir = "dist"'), 'Must target dist directory for Pages');
  assert.ok(wranglerContent.includes('anukool.jaipur@upi'), 'Must include VPA in environment vars');
  assert.ok(wranglerContent.includes('08AABCV1234F1Z8'), 'Must include GSTIN in environment vars');
});
