import { formatCurrency, SUPPORTED_CURRENCIES } from './currency.js';

export const money = (n, currencyCode = 'INR') => formatCurrency(n, currencyCode);

export const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const adminStatusLabel = (status) =>
  ({
    awaiting_payment: 'Awaiting payment',
    paid: 'Paid',
    processing: 'Processing',
    shipped: 'Shipped',
    completed: 'Completed',
    cancelled: 'Cancelled',
    payment_failed: 'Payment failed',
    refunded: 'Refunded'
  }[status] || status);

export { SUPPORTED_CURRENCIES, formatCurrency };
