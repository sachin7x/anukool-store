/**
 * Anukool Agentic Feed Validator
 * Complies with commercetools 'Production Readiness' automated validation script standard.
 * Verifies that 100% of products meet strict schema requirements for AI platform ingestion.
 */

const fs = require('fs');
const path = require('path');

async function validateFeed() {
  console.log('--- ANUKOOL AGENTIC FEED VALIDATION (COMMERCETOOLS STANDARD) ---');

  // Dynamic import of ES modules
  const { MASTER_CATALOG } = await import('../src/lib/productTailoring.js');

  console.log(`Auditing ${MASTER_CATALOG.length} catalog items...\n`);

  const REQUIRED_FIELDS = [
    'id', 'sku', 'gtin', 'name', 'tailoredTitle', 'tailoredDescription',
    'category', 'price', 'mrp', 'availability', 'stock', 'brand',
    'craftTime', 'materials', 'dimensions', 'components', 'image',
    'images', 'returnWindowDays', 'occasion'
  ];

  let errors = 0;
  let audited = 0;

  for (const item of MASTER_CATALOG) {
    audited++;
    const itemErrors = [];

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (item[field] === undefined || item[field] === null || item[field] === '') {
        itemErrors.push(`Missing required field: ${field}`);
      }
    }

    // SKU Format
    if (item.sku && !/^ANK-[A-Z]{2}-\d{3}$/.test(item.sku)) {
      itemErrors.push(`Invalid SKU format: ${item.sku}. Must match ANK-XX-000`);
    }

    // GTIN-13 Format
    if (item.gtin && !/^\d{13}$/.test(item.gtin)) {
      itemErrors.push(`Invalid GTIN-13 format: ${item.gtin}. Must be 13 digits.`);
    }

    // Pricing logic
    if (item.price <= 0) {
      itemErrors.push(`Price must be > 0. Found: ${item.price}`);
    }
    if (item.mrp < item.price) {
      itemErrors.push(`MRP (${item.mrp}) cannot be lower than selling price (${item.price})`);
    }

    // Stock & Availability
    if (item.stock < 0) {
      itemErrors.push(`Stock cannot be negative: ${item.stock}`);
    }
    if (item.availability !== 'in_stock') {
      itemErrors.push(`Availability invalid: ${item.availability}`);
    }

    // Rich narrative description length
    if (item.tailoredDescription && item.tailoredDescription.length < 30) {
      itemErrors.push(`Tailored description too short for semantic embedding (<30 chars)`);
    }

    // Image assets existence in public/dist
    if (item.image) {
      const publicPath = path.join(__dirname, '..', 'public', item.image);
      const distPath = path.join(__dirname, '..', 'dist', item.image);
      if (!fs.existsSync(publicPath) && !fs.existsSync(distPath)) {
        itemErrors.push(`Image file not found on disk: ${item.image}`);
      }
    }

    if (itemErrors.length > 0) {
      console.error(`❌ Item #${item.id} (${item.name}):`);
      itemErrors.forEach(err => console.error(`   - ${err}`));
      errors++;
    } else {
      console.log(`✔ Item #${item.id} [${item.sku}] — ${item.name} (Valid GTIN: ${item.gtin}, Stock: ${item.stock})`);
    }
  }

  console.log('\n--------------------------------------------------------------');
  if (errors === 0) {
    console.log(`✅ SUCCESS: All ${audited}/${MASTER_CATALOG.length} items passed 100% Agentic Commerce compliance.`);
    return true;
  } else {
    console.error(`❌ FAILED: ${errors} items failed compliance checks.`);
    return false;
  }
}

if (require.main === module) {
  validateFeed().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(err => {
    console.error('Fatal validation error:', err);
    process.exit(1);
  });
}

module.exports = { validateFeed };
