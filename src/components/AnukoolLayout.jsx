import React from 'react';
import { ArrowLeft } from 'lucide-react';

export function AnukoolLoadingSpinner() {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', background: '#F8F4E9' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48,
          height: 48,
          border: '4px solid #e8e1d7',
          borderTopColor: '#2E3A8A',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#2E3A8A', margin: 0 }}>
          Crafting your experience...
        </p>
      </div>
    </div>
  );
}

export function AnukoolPageHeader({ onBack }) {
  return (
    <header className="anukool-page-header">
      <a className="brand" href="#" onClick={e => { e.preventDefault(); onBack(); }}>
        anu<span style={{ color: '#C75B39' }}>kool</span><i>.</i>
      </a>
      <button className="page-back-btn" onClick={onBack}>
        <ArrowLeft size={14} /> BACK TO STORE
      </button>
    </header>
  );
}

export function AnukoolPageFooter({ onNavigate }) {
  return (
    <footer style={{ background: '#1c245c', color: '#fbf7ef', padding: '48px 0 24px', marginTop: 50 }}>
      <div className="wrap" style={{ textAlign: 'center' }}>
        <a
          className="brand"
          href="#"
          onClick={e => { e.preventDefault(); onNavigate('store'); }}
          style={{ color: '#fbf7ef', display: 'inline-block', marginBottom: 12 }}
        >
          anu<span style={{ color: '#C75B39' }}>kool</span><i>.</i>
        </a>
        <p style={{ fontSize: 13, color: '#bcb5a8', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.8 }}>
          Block-printed DIY textile kits from Jaipur. Designed for the joy of making and the warmth of giving.
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          {[
            ['OUR STORY', 'story'],
            ['HOW IT WORKS', 'howitworks'],
            ['FAQS', 'faq'],
            ['SHIPPING & RETURNS', 'shipping'],
            ['BRAND ASSETS', 'press'],
            ['CONTACT US', 'contact']
          ].map(([label, pg]) => (
            <button
              key={pg}
              onClick={() => onNavigate(pg)}
              style={{ background: 'none', border: 0, color: '#d0c8be', fontSize: 10, fontWeight: 800, letterSpacing: '.08em', cursor: 'pointer' }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 20, color: '#a29c91', fontSize: 9, letterSpacing: '.08em' }}>
          © 2026 ANUKOOL ✦ CRAFTED FOR CONNECTION ✦ V K ENTERPRISES, JAIPUR
        </div>
      </div>
    </footer>
  );
}
