# Tech Architecture

## Overview
Describe the high‑level system architecture for ANUKOOL, including major services, databases, APIs, and integrations.

## Components
- Frontend (React)
- Backend (Node.js / Express)
- Database (PostgreSQL)
- Payment Gateway (Stripe)
- External APIs (Shopify, Mailchimp, etc.)

## Diagram
```mermaid
classDiagram
    class Frontend {
        +React components
        +Next.js pages
    }
    class Backend {
        +Express routes
        +Business logic
    }
    class Database {
        +PostgreSQL tables
    }
    class PaymentGateway {
        +Stripe API
    }
    Frontend --> Backend : Calls API
    Backend --> Database : Queries
    Backend --> PaymentGateway : Uses
```

## Links to Research
- [Technical Research](file:///Users/sachin/CATCH/separated_projects/DELIVERABLES/ANUKOOL_product_research/tech_research.md)
