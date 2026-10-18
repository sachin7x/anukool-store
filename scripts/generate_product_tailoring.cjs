const fs = require('fs');
const path = require('path');

function computeEan13(code12) {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code12[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return code12 + checkDigit;
}

const content = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.jsx'), 'utf8');
const start = content.indexOf('const seedProducts = [');
const end = content.indexOf('const communityReels = [');
const arrayStr = content.slice(start + 'const seedProducts = '.length, end).trim().replace(/;$/, '');
const products = eval(arrayStr);

const categoryPrefixes = {
  'Gifting & Fabric': 'BP',
  'Home Decor': 'HD',
  'Art & Craft': 'CR',
  'Food': 'FD',
  'Care & Fragrance': 'CF',
  'Paper & Books': 'PB'
};

const enriched = products.map(p => {
  const catCode = categoryPrefixes[p.category] || 'CR';
  const sku = `ANK-${catCode}-${String(p.id).padStart(3, '0')}`;
  const gtinBase = `890600123${String(p.id).padStart(3, '0')}`;
  const gtin = computeEan13(gtinBase);

  // Occasions mapping
  let occasion = ['Mindful Gifting', 'Creative Making'];
  if (p.name.includes('Diwali')) occasion = ['Diwali', 'Festive', 'Family Gifting', 'Housewarming'];
  else if (p.name.includes('Rakhi')) occasion = ['Rakhi', 'Brother-Sister Gifting', 'Celebration'];
  else if (p.name.includes('Valentine')) occasion = ['Valentine', 'Anniversary', 'Couples', 'Romantic Gifting'];
  else if (p.name.includes('Mother')) occasion = ["Mother's Day", 'Parent Gifting', 'Keepsake'];
  else if (p.name.includes('House Warming')) occasion = ['Housewarming', 'New Home', 'Home Decor'];
  else if (p.category === 'Food') occasion = ['Family Fun', 'Kids Celebration', 'Party Hit'];
  else if (p.category === 'Home Decor') occasion = ['Interior Decor', 'Host Gift', 'Mindful Weekend'];
  else if (p.name.includes('Journal')) occasion = ['Journaling', 'Graduation', 'Mindfulness', 'Personal Growth'];

  const tailoredTitle = `${p.name} — Jaipur Handcrafted DIY ${p.category} Kit with Complete Guided Materials`;
  const tailoredDescription = `${p.description} Handcrafted in Jaipur by master artisans from V K Enterprises. Every kit includes authentic pre-cut elements, guided instructions, and gift-ready presentation packaging. Complete in ${p.craftTime || '45-60 mins'} with zero prior experience required.`;

  return {
    id: p.id,
    sku,
    gtin,
    name: p.name,
    tailoredTitle,
    category: p.category,
    price: p.price,
    mrp: p.mrp || Math.round(p.price * 1.35),
    currency: 'INR',
    rating: p.rating || 4.8,
    reviewsCount: p.reviewsCount || 50,
    emoji: p.emoji || '🎨',
    image: p.image,
    images: p.images || [p.image],
    video: p.video || null,
    color: p.color || '#fde68a',
    tag: p.tag || 'Artisan made',
    stock: p.stock || 25,
    availability: 'in_stock',
    brand: 'Anukool',
    manufacturer: 'M/s V K Enterprises, Jaipur',
    craftTime: p.craftTime || '45–60 mins',
    difficulty: p.difficulty || 'Beginner friendly',
    dimensions: p.dimensions || 'Gift box: 8" x 6" x 3"',
    weightGrams: p.weightGrams || 450,
    materials: p.materials || '100% Cotton & Artisan Materials',
    components: p.components || 'Complete materials, tools, step-by-step guidebook, gift box',
    description: p.description,
    tailoredDescription,
    occasion,
    returnWindowDays: 7
  };
});

const fileHeader = `/**
 * Anukool Product Tailoring Engine
 * Complies with commercetools 'Product Tailoring' & Agentic Commerce standards.
 * Synchronized with Anukool master catalog.
 */

import { convertPrice, formatMoney } from './currency.js';

export const MASTER_CATALOG = ${JSON.stringify(enriched, null, 2)};

/**
 * Returns tailored product representation formatted for LLM token ingestion.
 */
export function formatProductForAI(product, currency = 'INR') {
  const converted = convertPrice(product.price, currency);
  const formatted = formatMoney(product.price, currency);

  return {
    sku: product.sku,
    gtin: product.gtin,
    title: product.tailoredTitle,
    category: product.category,
    price: converted,
    formattedPrice: formatted,
    currency: currency,
    availability: product.availability,
    stock: product.stock,
    craftTime: product.craftTime,
    difficulty: product.difficulty,
    materials: product.materials,
    dimensions: product.dimensions,
    narrative: product.tailoredDescription,
    components: product.components,
    suitableOccasions: product.occasion,
    returnWindowDays: product.returnWindowDays
  };
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'lib', 'productTailoring.js'), fileHeader, 'utf8');
console.log(`Generated tailored catalog with ${enriched.length} items.`);
