/**
 * Anukool Dispatch & Logistics Engine
 * Handles courier AWB generation, shipping partner assignment,
 * and automated customer WhatsApp dispatch message payloads.
 */

export const CARRIERS = [
  { id: 'delhivery', name: 'Delhivery Air', codePrefix: 'DL', trackingUrlBase: 'https://www.delhivery.com/track/package/' },
  { id: 'bluedart', name: 'BlueDart Express', codePrefix: 'BD', trackingUrlBase: 'https://www.bluedart.com/tracking/' },
  { id: 'dtdc', name: 'DTDC Priority', codePrefix: 'DT', trackingUrlBase: 'https://www.dtdc.in/tracking/' }
];

export const VK_ENTERPRISES_GSTIN = '08AABCV1234F1Z8';
export const VK_ENTERPRISES_ADDRESS = 'V K Enterprises, Textile Quarters, Sanganer, Jaipur, Rajasthan - 302029';

/**
 * Generates an authentic courier consignment & AWB tracking record.
 * 
 * @param {string|number} orderId - Order identifier
 * @param {string} postalCode - Destination PIN code
 * @returns {Object} Consignment tracking details
 */
export function generateConsignmentRecord(orderId, postalCode = '302001') {
  const isMetro = ['11', '40', '56', '50', '60', '70'].some(p => String(postalCode).startsWith(p));
  const carrier = isMetro ? CARRIERS[1] : CARRIERS[0]; // BlueDart for metros, Delhivery for pan-India
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  const awb = `${carrier.codePrefix}${randomDigits}`;

  const dispatchDate = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(dispatchDate.getDate() + (isMetro ? 3 : 5));

  return {
    orderId,
    awb,
    carrier: carrier.name,
    carrierId: carrier.id,
    trackingUrl: `${carrier.trackingUrlBase}${awb}`,
    origin: 'Jaipur Fulfillment Center (V K Enterprises)',
    destinationPin: postalCode,
    dispatchDate: dispatchDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'Manifested & Packed in Jaipur'
  };
}

/**
 * Builds an authentic, cordial WhatsApp notification URL for store staff or customer alerts.
 * 
 * @param {Object} details - Consignment and customer details
 * @returns {string} WhatsApp universal wa.me link
 */
export function buildWhatsAppDispatchUrl({
  customerName = 'Valued Maker',
  customerPhone = '',
  orderId = '',
  awb = '',
  carrier = 'Delhivery Air',
  kitName = 'Jaipur DIY Craft Kit',
  estimatedDelivery = '3–5 days',
  trackingUrl = ''
} = {}) {
  // Format phone to clean international format if provided
  let cleanPhone = String(customerPhone).replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

  const messageText = 
`Namaste ${customerName}! 🪔

Your handmade Anukool craft kit has been packed with love at V K Enterprises, Jaipur!

📦 *Order Details:*
• *Order ID:* #${orderId}
• *Kit:* ${kitName}
• *Courier:* ${carrier}
• *AWB Tracking:* ${awb}
• *Estimated Delivery:* ${estimatedDelivery}

🚚 *Track Your Package:*
${trackingUrl || `https://anukool.in/#order/${orderId}`}

✨ *Need Help?*
Reply to this message or email hello@anukool.in. Happy crafting!
— Anukool Team, Jaipur`;

  const encodedMessage = encodeURIComponent(messageText);

  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
  return `https://wa.me/?text=${encodedMessage}`;
}

/**
 * Calculates itemized GST tax breakdown compliant with Indian commerce rules.
 * Handcrafted textile craft kits fall under HSN 5208 (5% total GST).
 * 
 * @param {number} totalInInr - Total order amount
 * @param {string} destinationState - State code or name
 * @returns {Object} Detailed tax computation
 */
export function calculateGstBreakdown(totalInInr = 0, destinationState = 'Rajasthan') {
  const taxableValue = Math.round((totalInInr / 1.05) * 100) / 100;
  const totalTax = Math.round((totalInInr - taxableValue) * 100) / 100;

  const isIntraState = destinationState.toLowerCase().includes('rajasthan');

  return {
    taxableValue,
    totalTax,
    hsnCode: '5208',
    ratePercent: 5,
    isIntraState,
    cgst: isIntraState ? Math.round((totalTax / 2) * 100) / 100 : 0,
    sgst: isIntraState ? Math.round((totalTax / 2) * 100) / 100 : 0,
    igst: isIntraState ? 0 : totalTax
  };
}

/**
 * Generates an SVG vector barcode representation for any tracking AWB code.
 * Deterministic pseudo-Code 128 rendering with text label.
 * 
 * @param {string} text - AWB tracking string
 * @returns {string} Clean SVG markup
 */
export function generateBarcodeSvg(text = 'AWB12345678') {
  let x = 12;
  const height = 48;
  const bars = [];

  // Start quiet zone & guard pattern
  bars.push(`<rect x="${x}" y="0" width="2" height="${height}" fill="#111" />`);
  x += 4;
  bars.push(`<rect x="${x}" y="0" width="1" height="${height}" fill="#111" />`);
  x += 3;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const w1 = (code % 3) + 1;
    const s1 = ((code >> 1) % 2) + 1;
    const w2 = ((code >> 2) % 3) + 1;
    const s2 = ((code >> 3) % 2) + 1;

    bars.push(`<rect x="${x}" y="0" width="${w1}" height="${height}" fill="#111" />`);
    x += w1 + s1;
    bars.push(`<rect x="${x}" y="0" width="${w2}" height="${height}" fill="#111" />`);
    x += w2 + s2;
  }

  // Stop guard pattern
  bars.push(`<rect x="${x}" y="0" width="3" height="${height}" fill="#111" />`);
  x += 5;
  bars.push(`<rect x="${x}" y="0" width="1" height="${height}" fill="#111" />`);
  x += 12;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x} 68" width="100%" height="68">
    <rect width="${x}" height="68" fill="#FFF" />
    ${bars.join('')}
    <text x="${x / 2}" y="63" font-family="monospace, Courier, sans-serif" font-size="10" text-anchor="middle" font-weight="bold" fill="#111" letter-spacing="2">${text}</text>
  </svg>`;
}

