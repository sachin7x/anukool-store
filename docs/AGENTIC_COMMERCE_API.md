# Anukool Agentic Commerce API Specification

> **Commercetools Architecture Standard for Autonomous AI Shopping Agents**  
> Store Context: `anukool-jaipur-in` | Currency: Multi-Currency (`INR`, `USD`, `GBP`, `EUR`, `AED`, `CAD`)

---

## 1. Overview

Anukool provides a deterministic, machine-readable API designed for Large Language Model (LLM) agents, autonomous multi-agent shopping systems, and automated procurement bots. 

Conforming to the **Commercetools Agentic Commerce Architecture**, the system enforces:
1. **Isolated Store Context:** Immutable catalog scoping under `V K Enterprises, Jaipur`.
2. **Product Tailoring:** Dense narrative specifications, GTIN-13/EAN barcodes, dimensions, and craft skill classifications.
3. **Cryptographic Payment Tokens:** Single-use, amount-constrained payment authorization tokens with automated replay attack defense.
4. **Machine Discovery:** RFC-compliant discovery manifest at `/.well-known/ai-commerce.json`.

---

## 2. Discovery Endpoints

### 2.1 AI Commerce Manifest
- **URL:** `/.well-known/ai-commerce.json`
- **Method:** `GET`
- **Description:** Machine-readable catalog declaration, merchant identification, supported currency rates, and tool schemas.

#### Sample Manifest Excerpt:
```json
{
  "spec_version": "1.0",
  "store_id": "anukool-jaipur-in",
  "merchant": {
    "name": "Anukool",
    "legal_entity": "M/s V K Enterprises",
    "origin": "Jaipur, Rajasthan, India",
    "contact": "hello@anukool.in"
  },
  "currencies": ["INR", "USD", "GBP", "EUR", "AED", "CAD"],
  "free_shipping_threshold_inr": 999,
  "tools": [
    {
      "name": "search_kits",
      "description": "Search 22 handcrafted Jaipur craft kits by query, occasion, or price ceiling."
    },
    {
      "name": "get_kit_details",
      "description": "Fetch complete tailored kit specifications with EAN-13 GTIN, materials, and artisan background."
    },
    {
      "name": "estimate_shipping",
      "description": "Calculate exact courier delivery SLA and shipping costs by postal PIN code."
    },
    {
      "name": "create_agentic_order",
      "description": "Submit a cryptographically authorized order with replay-attack protection."
    }
  ]
}
```

### 2.2 LLM Navigation Manifest
- **URL:** `/llms.txt`
- **Method:** `GET`
- **Description:** Markdown context summarizing brand philosophy, product categories, and agent execution guidelines.

---

## 3. Tool Function Endpoints

The API methods are exported from [`src/lib/agenticCommerce.js`](file:///Users/sachin/Downloads/makegood-react-store/src/lib/agenticCommerce.js).

### 3.1 `searchKits`
Search the 22-kit catalog using semantic matching, occasion tags, and price ceilings.

#### Parameters:
| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `query` | `string` | No | `""` | Free-text search matching name, materials, or description. |
| `occasion` | `string` | No | `""` | Occasion filter (e.g. `'Diwali'`, `'Rakhi'`, `'Anniversary'`). |
| `maxPrice` | `number \| null` | No | `null` | Maximum price ceiling in the specified currency. |
| `currency` | `string` | No | `'INR'` | Target currency code (`'INR'`, `'USD'`, etc.). |
| `category` | `string` | No | `""` | Category filter (`'Gifting & Fabric'`, `'Crafts'`, etc.). |

#### Return Value:
```json
{
  "count": 2,
  "currency": "INR",
  "kits": [
    {
      "id": 1,
      "sku": "ANK-BP-001",
      "gtin": "8906001230014",
      "name": "Anukool Diwali Light-Making Kit",
      "price": 699,
      "formattedPrice": "₹699",
      "stock": 45,
      "summary": "Create two beautiful reusable fabric-covered diyas with Jaipur block-printed panels and warm LED tea lights."
    }
  ]
}
```

---

### 3.2 `getKitDetails`
Retrieve comprehensive, rich product specifications tailored for autonomous agent reasoning.

#### Parameters:
| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `productId` | `number` | Yes | — | Numeric product ID (1–22). |
| `currency` | `string` | No | `'INR'` | Currency for price output. |

#### Return Value:
```json
{
  "id": 1,
  "sku": "ANK-BP-001",
  "gtin": "8906001230014",
  "tailoredTitle": "Anukool Heritage Diwali Diya Light-Making Kit (Set of 2)",
  "category": "Gifting & Fabric",
  "price": 699,
  "currency": "INR",
  "formattedPrice": "₹699",
  "inStock": true,
  "stockCount": 45,
  "craftTime": "45–60 mins",
  "difficulty": "Beginner friendly (Ages 8+)",
  "materials": "100% Pure Jaipur Cotton, Glass mirrors, LED tea lights",
  "components": "Pre-cut fabric panels (2 sets), LED lights, Brass mirrors (12), Gift box",
  "dimensions": "4\" diameter x 3\" height each",
  "artisanProvenance": "Hand block-printed by Ramesh Ji Saini in Sanganer, Jaipur.",
  "images": [
    "/anukool-assets/1_443e4d06-c435-4199-befb-2892b9cfb4a8.png"
  ]
}
```

---

### 3.3 `estimateShipping`
Computes courier SLA and shipping charges based on Indian postal PIN code and cart subtotal.

#### Parameters:
| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `postalCode` | `string` | Yes | — | 6-digit Indian PIN code (e.g. `'302001'`). |
| `cartTotalInInr`| `number` | No | `0` | Subtotal in INR to determine free shipping eligibility. |
| `currency` | `string` | No | `'INR'` | Currency for fee formatting. |

#### Shipping Rules:
- **Free Shipping:** Applicable on all orders where subtotal $\ge ₹999$.
- **Standard Flat Fee:** ₹99 for orders below ₹999.
- **Express Courier:** Flat ₹199 (1–2 days delivery in metro zones).

#### Return Value:
```json
{
  "serviceable": true,
  "zone": "North Metro (Delhi-NCR / Jaipur)",
  "shippingFee": 0,
  "formattedShippingFee": "FREE",
  "estimatedDays": "2-3 business days",
  "carrier": "BlueDart Express / Delhivery Air"
}
```

---

### 3.4 `createAgenticOrder`
Executes an atomic, cryptographically verified checkout on behalf of the customer.

#### Parameters:
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `paymentToken` | `string` | Yes | Single-use signed token authorized for this exact order amount. |
| `items` | `Array<{ id, qty }>` | Yes | Array of product IDs and quantities. |
| `recipient` | `Object` | Yes | `{ name, email, phone }`. |
| `shippingAddress` | `Object` | Yes | `{ addressLine, city, state, postalCode }`. |
| `currency` | `string` | No | Currency of the transaction (default `'INR'`). |

#### Replay Attack & Token Security:
1. Every payment token must begin with `tok_agent_` and specify an authorized maximum amount.
2. Once processed, the token is recorded in `CONSUMED_TOKENS`. Subsequent submissions with the same token will fail immediately with `REPLAY_ATTACK_DETECTED`.
3. If order subtotal exceeds the authorized token amount, the request fails with `TOKEN_AMOUNT_EXCEEDED`.

#### Return Value (Success):
```json
{
  "success": true,
  "orderId": "ANK-AGT-1729243000-842",
  "status": "confirmed",
  "currency": "INR",
  "subtotal": 1398,
  "shippingFee": 0,
  "total": 1398,
  "formattedTotal": "₹1,398",
  "estimatedDelivery": "3-5 business days",
  "trackingNotice": "Dispatched from V K Enterprises, Jaipur."
}
```

---

## 4. Automated Testing & Compliance Gate

All Agentic Commerce tool endpoints are continuously verified via the deterministic test suite:
```bash
npm test tests/agentic_commerce_feed.test.js
```
- Audits all 22 catalog items against the Commercetools schema.
- Verifies GTIN-13 barcode validity and stock invariants.
- Validates token constraints and replay defense.
- **Result:** $R = +1.000$ (Exit code `0`).
