/**
 * Anukool Agentic Commerce Engine
 * Implements deterministic tool endpoints for AI agents and LLMs.
 * Follows commercetools Agentic Commerce architecture:
 * - Isolated Store context
 * - Product Tailoring retrieval
 * - Single-use amount-constrained payment authorization
 * - Immutable Order generation
 */

import { MASTER_CATALOG, formatProductForAI } from './productTailoring.js';
import { convertPrice, formatMoney } from './currency.js';

// Consumed single-use tokens registry to prevent replay attacks
const CONSUMED_TOKENS = new Set();

/**
 * Tool 1: search_kits
 * Semantic and parameter-based discovery for autonomous agents.
 */
export function searchKits({ query = '', occasion = '', maxPrice = null, currency = 'INR', category = '' } = {}) {
  const qLower = query.toLowerCase().trim();
  const occLower = occasion.toLowerCase().trim();
  const catLower = category.toLowerCase().trim();

  let matches = MASTER_CATALOG.filter(item => {
    // Category filter
    if (catLower && item.category.toLowerCase() !== catLower) {
      return false;
    }

    // Price filter in requested currency
    const priceInCurrency = convertPrice(item.price, currency);
    if (maxPrice !== null && priceInCurrency > maxPrice) {
      return false;
    }

    // Occasion filter
    if (occLower) {
      const matchOcc = item.occasion?.some(o => o.toLowerCase().includes(occLower));
      if (!matchOcc && !item.name.toLowerCase().includes(occLower) && !item.tailoredDescription.toLowerCase().includes(occLower)) {
        return false;
      }
    }

    // Query text match
    if (qLower) {
      const haystack = [
        item.name,
        item.tailoredTitle,
        item.tailoredDescription,
        item.materials,
        item.components,
        item.category,
        item.tag
      ].join(' ').toLowerCase();

      // Simple keyword matching
      const words = qLower.split(/\s+/);
      const hasMatch = words.some(w => haystack.includes(w));
      if (!hasMatch) return false;
    }

    return true;
  });

  return {
    totalFound: matches.length,
    currency,
    products: matches.map(p => formatProductForAI(p, currency))
  };
}

/**
 * Tool 2: get_kit_details
 * Detailed specifications for a selected kit.
 */
export function getKitDetails(skuOrId, currency = 'INR') {
  const found = MASTER_CATALOG.find(p => 
    String(p.id) === String(skuOrId) || 
    (p.sku && p.sku.toUpperCase() === String(skuOrId).toUpperCase())
  );

  if (!found) {
    return {
      error: 'PRODUCT_NOT_FOUND',
      message: `No Anukool craft kit found matching '${skuOrId}'`
    };
  }

  return {
    success: true,
    product: formatProductForAI(found, currency),
    rawCatalogItem: found
  };
}

/**
 * Tool 3: estimate_shipping
 * Calculates shipping charges, carriers, and delivery timeline.
 */
export function estimateShipping({ postalCode = '', country = 'IN', subtotal = 0, currency = 'INR' } = {}) {
  // Convert 999 INR threshold to target currency
  const threshold = convertPrice(999, currency);
  const standardFee = convertPrice(99, currency);

  const isFree = subtotal >= threshold;
  const shippingFee = isFree ? 0 : standardFee;
  const gapToFree = isFree ? 0 : Math.max(0, threshold - subtotal);

  // Delivery estimation
  let leadTime = '3–7 business days';
  const cleanPin = String(postalCode).trim();
  // Quick metro pin heuristic (Delhi, Mumbai, Bengaluru, Hyderabad, Kolkata, Chennai, Jaipur: starts with 11, 40, 56, 50, 70, 60, 30)
  if (['11', '40', '56', '50', '70', '60', '30'].some(prefix => cleanPin.startsWith(prefix))) {
    leadTime = '2–4 business days (Metro Express)';
  }

  return {
    serviceable: true,
    country,
    postalCode: cleanPin,
    currency,
    subtotal,
    shippingFee,
    formattedShipping: shippingFee === 0 ? 'FREE' : formatMoney(convertPrice(99, 'INR'), currency),
    isFreeShipping: isFree,
    thresholdForFree: threshold,
    gapToFreeShipping: gapToFree,
    estimatedDeliveryTime: leadTime,
    carrier: cleanPin.startsWith('30') ? 'Jaipur Artisan Express' : 'Delhivery Air / BlueDart',
    returnWindowDays: 7
  };
}

/**
 * Helper: Generate Mock Secure Payment Token
 * In real production, this token is produced by the AI Agent wallet/PSP.
 */
export function generateMockPaymentToken({ amount, currency = 'INR', customerEmail = 'customer@example.com', ttlSeconds = 900 }) {
  const expiresAt = Date.now() + (ttlSeconds * 1000);
  const raw = `${customerEmail}|${amount}|${currency}|${expiresAt}|anukool_secret_salt_2026`;
  // Simple deterministic base64 signature
  const signature = Buffer.from(raw).toString('base64');
  return `ank_tok_${signature}_${expiresAt}`;
}

/**
 * Helper: Validate Single-Use Amount-Constrained Payment Token
 */
export function validatePaymentToken(token, expectedAmount, expectedCurrency) {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'TOKEN_MISSING' };
  }

  if (CONSUMED_TOKENS.has(token)) {
    return { valid: false, reason: 'TOKEN_ALREADY_CONSUMED_REPLAY_ATTACK' };
  }

  const parts = token.split('_');
  if (parts.length < 4 || parts[0] !== 'ank' || parts[1] !== 'tok') {
    return { valid: false, reason: 'MALFORMED_TOKEN' };
  }

  const expiresAt = parseInt(parts[3], 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return { valid: false, reason: 'TOKEN_EXPIRED' };
  }

  try {
    const decoded = Buffer.from(parts[2], 'base64').toString('utf8');
    const [email, amountStr, currency, expTime] = decoded.split('|');

    if (currency !== expectedCurrency) {
      return { valid: false, reason: `CURRENCY_MISMATCH: expected ${expectedCurrency}, token for ${currency}` };
    }

    const tokenAmount = parseFloat(amountStr);
    // Allow tiny rounding delta for floating point currencies
    if (Math.abs(tokenAmount - expectedAmount) > 0.05) {
      return { valid: false, reason: `AMOUNT_MISMATCH: expected ${expectedAmount}, token authorized for ${tokenAmount}` };
    }

    return { valid: true, email, authorizedAmount: tokenAmount, currency };
  } catch (err) {
    return { valid: false, reason: 'TOKEN_SIGNATURE_INVALID' };
  }
}

/**
 * Tool 4: create_agentic_order
 * Executes complete autonomous checkout on behalf of customer.
 */
export function createAgenticOrder({ items = [], shippingAddress = {}, currency = 'INR', paymentToken = '' } = {}) {
  if (!items || items.length === 0) {
    return { success: false, error: 'CART_EMPTY', message: 'Order must contain at least 1 item.' };
  }

  if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.postalCode) {
    return { success: false, error: 'INVALID_ADDRESS', message: 'Shipping address requires name, address, and postal code.' };
  }

  // 1. Resolve Items & Calculate Subtotal
  let subtotal = 0;
  const lineItems = [];

  for (const entry of items) {
    const item = MASTER_CATALOG.find(p => p.id === entry.id || p.sku === entry.id);
    if (!item) {
      return { success: false, error: 'ITEM_NOT_FOUND', message: `Item id ${entry.id} does not exist in catalog.` };
    }
    if (item.stock < entry.quantity) {
      return { success: false, error: 'INSUFFICIENT_STOCK', message: `Item ${item.name} has only ${item.stock} left in stock.` };
    }

    const price = convertPrice(item.price, currency);
    const lineTotal = price * entry.quantity;
    subtotal += lineTotal;

    lineItems.push({
      id: item.id,
      sku: item.sku,
      title: item.name,
      quantity: entry.quantity,
      unitPrice: price,
      lineTotal
    });
  }

  // 2. Shipping Calculation
  const shippingInfo = estimateShipping({
    postalCode: shippingAddress.postalCode,
    country: shippingAddress.country || 'IN',
    subtotal,
    currency
  });

  const total = subtotal + shippingInfo.shippingFee;

  // 3. Payment Token Verification (Single-Use, Amount-Constrained)
  const authResult = validatePaymentToken(paymentToken, total, currency);
  if (!authResult.valid) {
    return {
      success: false,
      error: 'PAYMENT_AUTHORIZATION_FAILED',
      reason: authResult.reason,
      expectedTotal: total,
      currency
    };
  }

  // 4. Mark token as consumed
  CONSUMED_TOKENS.add(paymentToken);

  // 5. Generate Order ID
  const orderNumber = `ANK-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderRecord = {
    orderNumber,
    channel: 'agentic_commerce',
    status: 'paid',
    paymentStatus: 'authorized_captured',
    paymentTokenRedeemed: paymentToken.slice(0, 16) + '...',
    currency,
    subtotal,
    shippingFee: shippingInfo.shippingFee,
    total,
    formattedTotal: formatMoney(total, currency),
    lineItems,
    shippingAddress,
    carrier: shippingInfo.carrier,
    estimatedDeliveryTime: shippingInfo.estimatedDeliveryTime,
    merchantOfRecord: 'M/s V K Enterprises, Jaipur',
    createdAt: new Date().toISOString()
  };

  return {
    success: true,
    order: orderRecord
  };
}
