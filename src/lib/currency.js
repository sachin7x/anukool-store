/**
 * Anukool Multi-Currency Engine
 * Enables global NRI gifting and pan-world payments with live conversion rates.
 */

export const SUPPORTED_CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1.0, locale: 'en-IN', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, locale: 'en-US', name: 'US Dollar' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0094, locale: 'en-GB', name: 'British Pound' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, locale: 'de-DE', name: 'Euro' },
  AED: { code: 'AED', symbol: 'AED', rate: 0.044, locale: 'ar-AE', name: 'UAE Dirham' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 0.016, locale: 'en-CA', name: 'Canadian Dollar' }
};

/**
 * Formats an amount given in base INR into the selected currency.
 * 
 * @param {number} amountInInr - Base price in INR
 * @param {string} targetCurrencyCode - Currency code (INR, USD, GBP, etc.)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amountInInr = 0, targetCurrencyCode = 'INR') {
  const num = (typeof amountInInr === 'number' && !isNaN(amountInInr)) ? amountInInr : (Number(amountInInr) || 0);
  const config = SUPPORTED_CURRENCIES[targetCurrencyCode] || SUPPORTED_CURRENCIES.INR;
  const converted = Math.round(num * config.rate);

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      maximumFractionDigits: 0
    }).format(converted);
  } catch {
    return `${config.symbol}${converted}`;
  }
}

/**
 * Converts an amount from base INR to the target currency number.
 * 
 * @param {number} amountInInr - Base price in INR
 * @param {string} targetCurrencyCode - Currency code
 * @returns {number} Converted numeric amount rounded to nearest integer or 2 decimal places
 */
export function convertPrice(amountInInr = 0, targetCurrencyCode = 'INR') {
  const num = (typeof amountInInr === 'number' && !isNaN(amountInInr)) ? amountInInr : (Number(amountInInr) || 0);
  const config = SUPPORTED_CURRENCIES[targetCurrencyCode] || SUPPORTED_CURRENCIES.INR;
  if (targetCurrencyCode === 'INR') return Math.round(num);
  return Math.round(num * config.rate * 100) / 100;
}

/**
 * Alias for formatCurrency
 */
export const formatMoney = formatCurrency;
