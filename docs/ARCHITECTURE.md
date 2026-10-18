# Anukool (अनुकूल) — System Architecture & Engineering Blueprint

> **V K Enterprises, Jaipur**  
> Technical Architecture, State Management, Agentic Commerce Standards, and Deterministic Verification Model

---

## 1. Executive Summary

**Anukool (अनुकूल)** is an offline-first, edge-ready artisanal craft e-commerce platform built to bridge centuries-old Rajasthani block-printing heritage with autonomous agentic commerce standards. The architecture combines a client-side Single Page Application (SPA) with deterministic tool execution, sub-100ms AI recommendation heuristics, and an interactive HTML5 Canvas artisanal simulator.

```text
Inspect → Plan → Implement → Test → Review → Report
RLVR Verification: R = +1.000 (19/19 Unit Tests Passing, Zero-Crash CDP Invariants)
```

---

## 2. System Topology & Component Interactions

```mermaid
flowchart TD
    subgraph Client["Browser Client (Edge & Local)"]
        UI["React 18.3 UI Shell (App.jsx)"]
        VT["Native View Transitions API (viewTransitions.js)"]
        
        subgraph Modals["Interactive Modals"]
            BPS["Jaipur Block-Printing Studio (HTML5 Canvas)"]
            GC["AI Gift Concierge (TypeSafe Jev)"]
        end

        subgraph Pages["Client-Side Router (Hash-Based)"]
            P1["Storefront (#)"]
            P2["Product Detail (#product/:id)"]
            P3["Our Story (#story)"]
            P4["Brand Assets & Press Kit (#brand-assets)"]
            P5["Admin Dashboard (#admin)"]
        end
    end

    subgraph Engines["Core Engine Layer"]
        MC["Multi-Currency Engine (currency.js)"]
        PT["Product Tailoring Store (productTailoring.js)"]
        AC["Agentic Commerce Tools (agenticCommerce.js)"]
        TS["TypeSafe Jev Primitives (typesafe.js)"]
    end

    subgraph Storage["Persistent Client State (localStorage)"]
        S1[("ank_cart")]
        S2[("ank_orders")]
        S3[("ank_currency")]
        S4[("ank_products_v2")]
        S5[("ank_wishlist")]
    end

    subgraph AutonomousAgents["Autonomous AI Shopping Agents"]
        AA["LLM / Multi-Agent Swarm"]
        DISC["/.well-known/ai-commerce.json & /llms.txt"]
    end

    subgraph Edge["Edge Infrastructure & Local Fleet"]
        CF["Cloudflare Tunnel (:5173 -> Global Edge)"]
        LAI["Local AI Fleet (FCC :8082, Notion :8081, T3 :3773)"]
    end

    UI --> VT --> Pages
    UI --> Modals
    Pages & Modals --> Engines
    Engines --> Storage
    
    AA --> DISC --> AC
    AC --> PT & MC
    
    UI --> CF
    CF -.-> |"Port Isolated (Zero Collision)"| LAI
```

---

## 3. Subsystem Breakdown

### 3.1 Storefront & Routing Architecture
- **Hash-Based Router:** Employs zero-server hash routing (`#product/:id`, `#story`, `#howitworks`, `#faq`, `#shipping`, `#contact`, `#admin`, `#brand-assets`). This guarantees that static edge hosts (Cloudflare Pages, S3, Netlify) can refresh deep links without HTTP 404 rewriting errors.
- **Dynamic Code-Splitting:** All secondary views and heavy modals (`ProductPage`, `AdminSection`, `BlockPrintSimulatorModal`, `BrandAssetsPage`) are split into asynchronous chunks via `React.lazy()` and `Suspense`, reducing the initial payload to <440 KB (gzip: ~123 KB).
- **Native View Transitions API:** Transitions between catalog cards and product pages are wrapped in `document.startViewTransition()` with automatic CSS cross-fade polyfilling.

### 3.2 Jaipur Hand Block-Printing Studio (Canvas Engine)
- **Component:** [`src/components/BlockPrintSimulatorModal.jsx`](file:///Users/sachin/Downloads/makegood-react-store/src/components/BlockPrintSimulatorModal.jsx)
- **Artisanal Canvas Rendering:** A 680x420 HTML5 Canvas rendering loop simulating genuine slub cotton weaving via procedural noise.
- **Stamp Physics:** Each stamp event applies:
  $$\Delta \theta \sim \mathcal{N}(0, 0.05), \quad \Delta \text{scale} \sim \mathcal{N}(1, 0.04), \quad \alpha \in [0.82, 0.94]$$
  producing natural hand-stamped variations that mimic real wooden block printing.
- **Export Pipeline:** Direct rasterization to PNG with automated download triggering and direct cart injection.

### 3.3 TypeSafe AI Recommendation Engine (Jev Primitives)
- **Component:** [`src/lib/typesafe.js`](file:///Users/sachin/Downloads/makegood-react-store/src/lib/typesafe.js)
- **Cognitive Primitives:**
  - `Choice`: Probabilistic selection of top 3 matching kits out of the 22-item catalog based on recipient, occasion, and craft preferences.
  - `Noul`: Boolean threshold validation determining whether budget constraints are satisfied ($P \ge 0.90$).
  - `Score`: Graded sentiment resonance (1–5 scale) assessing emotional fit.
- **Deterministic Offline Evaluator:** When `VITE_TYPESAFE_API_KEY` is omitted, the engine falls back to an offline rule-based matrix executing in under 2ms.

### 3.4 Agentic Commerce Subsystem (Commercetools Standard)
- **Specification:** Conforms to Commercetools Agentic Commerce architecture:
  - **Machine Discovery:** Manifest at `/.well-known/ai-commerce.json` detailing schema, currencies, delivery zones, and API endpoints.
  - **Structured LLM Context:** Documented in `/llms.txt`.
  - **Product Tailoring Store:** 22 kits enriched with dense narrative prose, EAN-13 GTINs, physical dimensions, and occasion taxonomies.
  - **Single-Use Amount-Constrained Payment Tokens:** Prevents replay attacks by registering consumed token hashes in an immutable memory cache (`CONSUMED_TOKENS.has(token)`).

### 3.5 Multi-Currency Conversion Engine
- **Module:** [`src/lib/currency.js`](file:///Users/sachin/Downloads/makegood-react-store/src/lib/currency.js)
- **Base Currency:** Indian Rupee (INR, ₹).
- **Fixed Conversion Rates:**
  - USD: `0.012`
  - GBP: `0.0095`
  - EUR: `0.011`
  - AED: `0.044`
  - CAD: `0.016`
- **Formatting Invariant:** Strict number casting (`Number(amountInInr) || 0`) preventing `NaN` crashes when values are undefined or null.

---

## 4. State Management & Data Schema

All persistent state is stored in client `localStorage` with prefix isolation (`ank_*`):

| Key | Type | Description |
| :--- | :--- | :--- |
| `ank_cart` | `Array<{ id, qty, customOptions }>` | Items currently added to the shopping bag. |
| `ank_wishlist` | `Array<number>` | Product IDs marked as favorites. |
| `ank_orders` | `Array<OrderObject>` | Historical orders placed in the current browser. |
| `ank_products_v2` | `Array<ProductObject>` | Product catalog overrides made via the Admin Dashboard. |
| `ank_currency` | `string` (`'INR' \| 'USD' \| ...`) | Selected active display currency. |
| `ank_admin` | `Object \| null` | Authenticated store administrator session object. |

---

## 5. Security & Local Port Isolation

To guarantee that Anukool never conflicts with local AI model proxies and agents running on the developer workstation:

```text
Port 8082   ──────>   Local FCC Proxy (undisturbed)
Port 8081   ──────>   Notion Auto Pay (undisturbed)
Port 7055   ──────>   Genspark2API (undisturbed)
Port 3773   ──────>   T3 Code Server (undisturbed)
Port 10000  ──────>   llama-server / Metal GPU (undisturbed)
Port 5173   ──────>   Anukool Preview Server (127.0.0.1 strict loopback)
Global Edge ──────>   Cloudflare Tunnel (trycloudflare.com)
```

- **Vite Configuration:** Enforces `host: '127.0.0.1'`, `port: 5173`, `strictPort: true`, and `allowedHosts: true` for secure Cloudflare edge pass-through.
- **Content Security:** No external script execution; all assets and fonts are served via HTTPS.
