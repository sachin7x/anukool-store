/**
 * Anukool Payment Engine
 * Implements dual-mode payment orchestration:
 * 1. Native NPCI UPI Deep-Linking & Dynamic SVG QR Code Generation
 * 2. Razorpay Live Gateway Bridge with fallback simulation
 */

import QRCode from 'qrcode';

export const DEFAULT_VPA = 'anukool.jaipur@upi';
export const DEFAULT_MERCHANT_NAME = 'Anukool VK Enterprises';

/**
 * Builds standard NPCI-compliant UPI payment intent URI.
 * Spec: upi://pay?pa={vpa}&pn={name}&am={amount}&cu=INR&tn={transactionNote}
 * 
 * @param {Object} options
 * @param {string} [options.pa] - Payee VPA address (default: anukool.jaipur@upi)
 * @param {string} [options.pn] - Payee name (default: Anukool VK Enterprises)
 * @param {number} options.amount - Exact amount in INR
 * @param {string} options.orderId - Unique order identifier
 * @param {string} [options.note] - Transaction description
 * @returns {string} Fully encoded upi://pay URI
 */
export function buildUpiUrl({
  pa = DEFAULT_VPA,
  pn = DEFAULT_MERCHANT_NAME,
  amount = 0,
  orderId = '',
  note = ''
} = {}) {
  const encName = encodeURIComponent(pn);
  const encNote = encodeURIComponent(note || `Order ${orderId} - Anukool Jaipur`);
  const formattedAmount = Number(amount).toFixed(2);

  return `upi://pay?pa=${pa}&pn=${encName}&am=${formattedAmount}&cu=INR&tn=${encNote}`;
}

/**
 * Generates an SVG string representation of the QR code for a given UPI URL.
 * Renders in Anukool Jaipur Indigo (#2E3A8A) with crisp vector geometry.
 * 
 * @param {string} upiUrl - The upi:// URI to encode
 * @returns {Promise<string>} Clean SVG string
 */
export async function generateUpiQrSvg(upiUrl) {
  try {
    const svg = await QRCode.toString(upiUrl, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#2E3A8A', // Anukool Jaipur Indigo
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    return svg;
  } catch (err) {
    console.error('Failed to generate UPI QR code:', err);
    return '';
  }
}

/**
 * Simulates real-time webhook or payment verification polling.
 * Resolves with success after the user completes payment on mobile.
 * 
 * @param {Object} orderDetails - Order metadata and amount
 * @param {number} [durationMs=3000] - Simulated bank processing delay
 * @returns {Promise<{ success: boolean, paymentId: string, timestamp: string }>}
 */
export function simulateUpiVerification(orderDetails, durationMs = 3000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockPaymentId = `pay_upi_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
      resolve({
        success: true,
        paymentId: mockPaymentId,
        timestamp: new Date().toISOString()
      });
    }, durationMs);
  });
}

/**
 * Orchestrates Razorpay checkout if keys are present; falls back gracefully.
 * 
 * @param {Object} config - Razorpay options
 */
export function launchRazorpayGateway({
  amountInInr,
  orderId,
  customer,
  keyId = null,
  onSuccess,
  onFailure
}) {
  const activeKey = keyId || import.meta.env?.VITE_RAZORPAY_KEY_ID;

  if (activeKey && typeof window !== 'undefined' && window.Razorpay) {
    const options = {
      key: activeKey,
      amount: Math.round(amountInInr * 100), // In paise
      currency: 'INR',
      name: 'Anukool (V K Enterprises)',
      description: `Craft Kit Order #${orderId}`,
      image: '/anukool-favicon.svg',
      prefill: {
        name: customer?.name || '',
        email: customer?.email || '',
        contact: customer?.phone || ''
      },
      theme: {
        color: '#2E3A8A'
      },
      handler: function (response) {
        if (onSuccess) {
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        }
      },
      modal: {
        ondismiss: function () {
          if (onFailure) onFailure(new Error('Payment window dismissed by user.'));
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } else {
    // Demo Mode Simulation
    simulateUpiVerification({ orderId, amount: amountInInr }, 1500).then(onSuccess);
  }
}

/**
 * Returns saved payment configuration with defaults.
 * 
 * @returns {Object} Payment config object
 */
export function getPaymentConfig() {
  try {
    const saved = localStorage.getItem('ank_payment_config');
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    upiVpa: DEFAULT_VPA,
    merchantName: DEFAULT_MERCHANT_NAME,
    razorpayKeyId: 'rzp_test_1DP5mmOlF5G5ag',
    mode: 'upi_direct' // 'upi_direct' | 'razorpay_gateway'
  };
}

/**
 * Persists payment configuration to localStorage.
 * 
 * @param {Object} cfg - New payment configuration
 */
export function savePaymentConfig(cfg) {
  try {
    localStorage.setItem('ank_payment_config', JSON.stringify(cfg));
  } catch (err) {
    console.warn('Failed to save payment config:', err);
  }
}

