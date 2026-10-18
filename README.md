# Anukool (अनुकूल) — Jaipur Artisanal Craft Kits & Agentic Commerce Platform

> **"Crafted for Connection"** — Authentic Rajasthani block-printed DIY craft kits, multi-currency commerce, and deterministic AI agent tool interfaces by **V K Enterprises, Jaipur**.

[![RLVR Verification](https://img.shields.io/badge/RLVR%20Gate-R%20%3D%20%2B1.000-emerald?style=flat-square)](./tests/)
[![Automated Tests](https://img.shields.io/badge/Tests-19%2F19%20Passing-blue?style=flat-square)](./tests/)
[![Commercetools Standard](https://img.shields.io/badge/Agentic%20Commerce-Commercetools%20Compliant-indigo?style=flat-square)](./public/.well-known/ai-commerce.json)
[![Edge Network](https://img.shields.io/badge/Cloudflare%20Edge-Verified%20Live-orange?style=flat-square)](https://supporters-photographic-utility-tomato.trycloudflare.com)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG%20AA-success?style=flat-square)](./src/App.jsx)

---

## 🏛️ Brand & Heritage Overview

**Anukool (अनुकूल)** — derived from Sanskrit meaning *"favorable, well-suited, harmonious"* — is a contemporary craft and festive gifting brand rooted in the centuries-old textile traditions of Jaipur, Rajasthan. Backed by **V K Enterprises**, a trusted textile house with over 40 years of mastery, Anukool creates guided, all-inclusive DIY craft kits designed to make handmade gifting accessible to everyone regardless of prior artistic experience.

Every kit combines authentic hand block-printed cotton accents from Bagru and Sanganer artisans with pure natural mineral dyes, pre-calibrated tools, illustrated step-by-step guides, and luxury gift packaging.

---

## 🌟 Key Platform Features

### 1. Artisanal E-Commerce Storefront
- **22 Signature Craft Kits Catalog:** Comprehensive collections across Traditional Block-Printing, Festive Lighting (Diyas & Bottles), Terracotta/Ceramic Pottery, Botanical Aromatics, Miniature Painting, and Heritage Food Crafts (Ice Gola & Cotton Candy).
- **Dedicated Product Detail Pages (PDP):** Rich tabbed navigation (*Craft Details*, *What's in the Box*, *Jaipur Artisan Story*, *Delivery & Packaging*), high-resolution gallery zoom, stock meters, and related kits.
- **Interactive Community Reels:** Native vertical video players with hover/tap controls showcasing maker tutorials and customer creations.
- **Brand Pages Suite:** Fully responsive dedicated editorial pages for [`Our Story`](#story), [`How It Works`](#howitworks), [`FAQs`](#faq), [`Shipping & Policies`](#shipping), [`Contact Us`](#contact), and [`Brand Assets & Media Kit`](#brand-assets).

### 2. Interactive Jaipur Block-Printing Studio
- **HTML5 Canvas Artisanal Simulator:** An interactive workshop modal allowing customers to choose between authentic hand-carved wooden blocks (Jaipur Paisley, Royal Lotus, Elephant, Suraj Mandala, Sanganer Vine) and mineral vegetable dyes (Jaipur Indigo `#2E3A8A`, Terracotta `#C75B39`, Marigold Gold `#D4AF37`, Emerald Green `#10B981`, Charcoal `#1A1A1A`).
- **Tactile Physics:** Includes micro-rotational variance, pressure-sensitive stamping bleed, and slub cotton fabric texturing.
- **Direct-to-Bag Action:** Customers can download their stamped design as a PNG or directly order their custom-configured block-printing kit.

### 3. TypeSafe AI System One (Jev) Gift Concierge
- **Cognitive Recommendations:** Utilizes TypeSafe AI System One primitives (*Choice*, *Noul*, *Score*) to parse natural language intent, grade sentiment resonance, and provide probabilistic recommendations across the 22-kit catalog.
- **Sub-100ms Offline Fallback:** Integrated local evaluator ensures instantaneous zero-latency recommendations even without active external network connectivity.

### 4. Global Multi-Currency Engine
- **Supported Currencies:** **INR (₹)**, **USD ($)**, **GBP (£)**, **EUR (€)**, **AED (AED)**, and **CAD (CA$)**.
- **Dynamic Conversion & Persistence:** Real-time price conversions across catalog cards, modals, cart drawer, checkout, and order receipts with `localStorage` persistence (`ank_currency`).

### 5. Native View Transitions API
- Smooth, cinematic page morphing and cross-fade animations powered by browser-native `document.startViewTransition()` with seamless fallback for legacy clients.

### 6. Agentic Commerce Engine (Commercetools Standard)
- **Machine-Readable Discovery:** Automated discovery manifests located at `/.well-known/ai-commerce.json` and `/llms.txt`.
- **4 Deterministic Agent Tool Endpoints:**
  1. `search_kits`: Multi-parameter and semantic discovery with currency normalization.
  2. `get_kit_details`: Deep tailored kit inspection with EAN-13 GTIN, physical dimensions, and skill rating.
  3. `estimate_shipping`: Exact postal code carrier SLA calculation (Zone A–D).
  4. `create_agentic_order`: Replay-attack-defended, token-constrained order creation.
- **Cryptographic Security:** Single-use, amount-constrained payment authorization tokens preventing unauthorized re-billing or re-play attacks.

### 7. Administrative Control Panel
- **Secure Store Management:** Single-pane dashboard at `/#admin` featuring Overview KPI cards, Product CRUD (add, edit, toggle active, delete), Order fulfillment tracker, Customer directory, and Settings.
- **Zero-Crash Architecture:** Hardened with defensive null-checks and multi-state error boundaries.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18.3, Vite 6.4 (ESM Build Pipeline) |
| **Styling & Design System** | Custom Indian Luxury CSS System (Warm Saffron, Indigo Deep, Silk Cream, Heritage Gold) |
| **Icons & Visuals** | Lucide React, Custom SVG Vector Master Brand Marks |
| **Interactive Canvas** | HTML5 2D Canvas Context with Slub Texture Synthesis |
| **AI Recommendation** | TypeSafe AI System One (Jev Primitives) + Sub-100ms Local Fallback |
| **Agentic Protocol** | Commercetools Agentic Commerce Specification, JSON-LD Schema.org |
| **Edge Distribution** | Cloudflare Tunnel / Cloudflare Pages (QUIC & HTTP/2) |
| **Testing Harness** | Node.js Test Runner (`node:test`, `node:assert/strict`), Chrome DevTools Protocol (CDP) |

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js `20.x` or newer
- npm `10.x` or newer

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/vk-enterprises/anukool-react-store.git
cd anukool-react-store

# Install dependencies
npm install
```

### 2. Development Server
```bash
npm run dev
```
The development server will launch on `http://127.0.0.1:5173/`.

### 3. Production Build & Local Preview
```bash
# Build optimized production bundle
npm run build

# Preview production build locally on loopback port 5173
npm run preview
```

### 4. Running the Automated Test Suite (RLVR Gate)
```bash
npm test
```
Executes all 19 invariant tests covering:
- 100% Agentic Commerce feed validation (GTIN-13, EAN, stock, descriptions)
- Currency engine precision and math
- Cart mutations & free shipping business logic (Free above ₹999, flat ₹99 below)
- Catalog integrity & local media asset resolution
- WCAG accessibility invariants (ARIA modal roles, escape dismissal)

---

## 🌐 Public Deployment & Cloudflare Tunnel

Anukool is configured to run securely on loopback port `127.0.0.1:5173` without colliding with local AI servers (FCC proxy `8082`, Notion Auto Pay `8081`, Genspark2API `7055`, T3 Code `3773`, llama-server `10000`).

To expose the store globally via Cloudflare Quick Tunnel:
```bash
cloudflared tunnel --url http://127.0.0.1:5173
```
Active Live Demo: **[https://supporters-photographic-utility-tomato.trycloudflare.com](https://supporters-photographic-utility-tomato.trycloudflare.com)**

---

## 📁 Repository Directory Structure

```text
├── public/
│   ├── .well-known/
│   │   └── ai-commerce.json          # Machine-readable Agentic Commerce manifest
│   ├── anukool-assets/               # Cloned high-res images, video reels, and logos (292 files)
│   ├── anukool-favicon.svg           # High-DPI Sanskrit wooden stamp favicon
│   ├── anukool-hero.svg              # Master vector hero illustration
│   ├── anukool-logo-primary.svg      # Primary brand lockup (Light background)
│   ├── anukool-logo-reversed.svg     # Reversed brand lockup (Dark indigo background)
│   └── llms.txt                      # Autonomous agent navigation standard
├── src/
│   ├── components/
│   │   ├── AnukoolLayout.jsx         # Shared header, navigation, and footer
│   │   ├── BlockPrintSimulatorModal.jsx # Interactive Jaipur Canvas Block-Printing Studio
│   │   ├── GiftConciergeModal.jsx    # TypeSafe AI Jev gift recommendation modal
│   │   ├── Newsletter.jsx            # Workshop newsletter subscription
│   │   └── ProductCard.jsx           # Editorial product listing cards
│   ├── lib/
│   │   ├── agenticCommerce.js        # Deterministic tool endpoints for AI agents
│   │   ├── currency.js               # Multi-currency conversion & formatting engine
│   │   ├── productTailoring.js       # Dense narrative prose, GTIN-13, and kit metadata
│   │   ├── typesafe.js               # TypeSafe AI System One integration & offline evaluator
│   │   └── viewTransitions.js        # Native View Transitions API utility
│   ├── pages/
│   │   ├── AdminSection.jsx          # Hardened store management dashboard
│   │   ├── BrandAssetsPage.jsx       # Press kit, vector logos, colors & boilerplate
│   │   ├── ContactPage.jsx           # Inquiries & corporate gifting form
│   │   ├── FAQPage.jsx               # Categorized accordions
│   │   ├── HowItWorksPage.jsx        # 3-step maker onboarding & in-the-box guide
│   │   ├── OurStoryPage.jsx          # Jaipur heritage & V K Enterprises story
│   │   ├── ProductPage.jsx           # Dedicated Product Detail Page (PDP)
│   │   └── ShippingPage.jsx          # Shipping tiers & return policies
│   ├── App.jsx                       # Main application shell & client router
│   ├── main.jsx                      # React 18 DOM mount point
│   └── styles.css                    # Unified Indian luxury stylesheet
├── tests/
│   ├── agentic_commerce_feed.test.js # Commercetools compliance & GTIN tests
│   └── store_business_logic.test.js  # Cart, currency, WCAG, and catalog integrity tests
├── docs/
│   ├── ARCHITECTURE.md               # Deep system architecture & data flow
│   └── AGENTIC_COMMERCE_API.md       # AI agent tool reference & integration guide
├── scripts/
│   ├── devtools_test.cjs             # Automated Chrome DevTools Protocol test harness
│   ├── test_admin_login.cjs          # Admin portal headless login verification
│   └── validate_agentic_feed.cjs     # Catalog feed compliance validator
├── vite.config.js                    # Vite configuration (Port 5173, allowedHosts: true)
└── package.json                      # Project dependencies & npm scripts
```

---

## 🔒 Security & Verification Standards

- **RLVR Verification Gate:** Every code change and feature rollout must satisfy deterministic verification tests returning exit code `0` ($R = +1.000$) before deployment.
- **Replay Attack Defense:** Agentic order creation enforces single-use, cryptographically verified payment tokens registered in an ephemeral replay-prevention memory store.
- **Credential Hygiene:** No secrets, `.env` files, or private keys are exposed to client bundles.

---

## 📄 License & Attribution

© 2026 **Anukool (अनुकूल)** — A sub-brand of **M/s V K Enterprises, Jaipur, Rajasthan, India**.  
All rights reserved. Handcrafted with pride in Jaipur.
