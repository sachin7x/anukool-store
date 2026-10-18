import React, { useState } from "react";
import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import { AnukoolPageHeader, AnukoolPageFooter } from "../components/AnukoolLayout";

function FAQPage({ onBack, onNavigate }) {
  const [openItem, setOpenItem] = useState('Ordering & Payment0');

  const faqs = [
    {
      category: 'Ordering & Payment',
      items: [
        { q: 'What payment options do you support?', a: 'We accept all Indian UPI apps (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), and Net Banking across 50+ banks. In local preview mode, you can also place demo orders instantly.' },
        { q: 'Can I cancel or edit my order after placing it?', a: 'Yes! You can edit shipping details or cancel an order within 1 hour of placing it by emailing hello@anukool.in with your order number. Once dispatched, we follow our standard 7-day return policy.' },
        { q: 'Is GST included in the product price?', a: 'Yes, 100% of prices listed on Anukool include all applicable GST. There are no hidden charges at checkout.' },
        { q: 'Do you offer bulk or corporate discounts?', a: 'Yes, for orders of 20 kits or more (festive gifting, company offsites, wedding favors), we offer custom volume pricing, bespoke fabric selections, and co-branded packaging. Please use our Contact page or email hello@anukool.in.' }
      ]
    },
    {
      category: 'Craft Kits & Making',
      items: [
        { q: 'Do I need any prior craft or sewing experience?', a: 'Not at all! Anukool kits are designed specifically for beginners. Panels are precision pre-cut, adhesives are pre-measured, and every step is illustrated visually.' },
        { q: 'How long does a typical kit take to complete?', a: 'Most kits (such as the Diwali Diya Kit or Rakhi Kit) take between 45 and 75 minutes. They are designed for a relaxing evening alone, a couples date, or family craft time.' },
        { q: 'What extra tools do I need at home?', a: 'Just a pair of standard household scissors and a clean flat table. Everything else — fabrics, embellishments, glue, tea lights, cords — is packed inside the box.' },
        { q: 'Are the materials child-safe?', a: 'Our kits are safe for children aged 8+ with adult supervision. Fabrics are 100% natural cotton dyed with eco-friendly pigments.' }
      ]
    },
    {
      category: 'Shipping & Delivery',
      items: [
        { q: 'Where do you ship?', a: 'We ship across India to all serviceable PIN codes through Bluedart, Delhivery, and DTDC. Metro deliveries take 3–4 business days; rest of India takes 4–6 business days.' },
        { q: 'How does free shipping work?', a: 'Any order with a cart value of ₹999 or higher automatically qualifies for free pan-India express shipping. Orders below ₹999 carry a flat ₹99 delivery charge.' },
        { q: 'How can I track my shipment?', a: 'You will receive an automated SMS and email containing the tracking URL as soon as our Jaipur dispatch team generates the airway bill.' }
      ]
    },
    {
      category: 'Returns & Refunds',
      items: [
        { q: 'What is your return policy?', a: 'We offer a hassle-free 7-day return window on unopened and unused kits. Contact hello@anukool.in to initiate a prepaid reverse pickup.' },
        { q: 'What if my package arrives damaged?', a: 'In the rare event of transit damage, simply take a quick photo and message us within 48 hours. We will immediately dispatch a free replacement box without asking for the damaged kit back.' }
      ]
    }
  ];

  return (
    <div className="anukool-page">
      <AnukoolPageHeader onBack={onBack} />
      <div className="anukool-page-hero">
        <div className="wrap">
          <div className="eyebrow">✦ ANSWERS & ASSISTANCE</div>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about our kits, materials, Jaipur artisans, and order delivery.</p>
        </div>
      </div>
      <div className="wrap faq-section">
        {faqs.map(cat => (
          <div className="faq-category" key={cat.category}>
            <div className="faq-category-title">
              <Sparkles size={14}/> {cat.category}
            </div>
            {cat.items.map((item, idx) => {
              const id = cat.category + idx;
              const isOpen = openItem === id;
              return (
                <div className="faq-item" key={id}>
                  <button className="faq-q" onClick={() => setOpenItem(isOpen ? '' : id)}>
                    <span>{item.q}</span>
                    <ChevronDown size={17} className={isOpen ? 'faq-chevron open' : 'faq-chevron'}/>
                  </button>
                  {isOpen && <div className="faq-a">{item.a}</div>}
                </div>
              );
            })}
          </div>
        ))}

        <div style={{ textAlign: 'center', padding: '40px 0 60px' }}>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 18 }}>Have a question that is not listed here?</p>
          <button className="button dark-button" onClick={() => onNavigate('contact')}>
            TALK TO OUR TEAM <ArrowUpRight size={16}/>
          </button>
        </div>
      </div>
      <AnukoolPageFooter onNavigate={onNavigate} />
    </div>
  );
}


export default FAQPage;
