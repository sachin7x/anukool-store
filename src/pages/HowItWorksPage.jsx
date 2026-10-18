import React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { AnukoolPageHeader, AnukoolPageFooter } from "../components/AnukoolLayout";

function HowItWorksPage({ onBack, onNavigate }) {
  return (
    <div className="anukool-page">
      <AnukoolPageHeader onBack={onBack} />
      <div className="anukool-page-hero">
        <div className="wrap">
          <div className="eyebrow">✦ THE GUIDED EXPERIENCE</div>
          <h1>Crafting made joyful and foolproof.</h1>
          <p>No previous craft experience required. Our kits are engineered so beginners succeed every single time, in under 60 minutes.</p>
        </div>
      </div>

      <div className="wrap">
        <div className="how-steps">
          <div className="how-step">
            <div className="how-step-visual">
              <img src="/generated-assets/anukool_diwali_craft_kit_1792356758897.jpg" alt="Choose your kit" className="how-step-img" />
              <div className="how-step-num">1</div>
            </div>
            <h3>Choose Your Occasion</h3>
            <p>Select from festive kits (Diwali fabric diyas, Rakhi bonding bracelets), keepsake gratitude journals, or heartfelt parent appreciation gifts.</p>
          </div>
          <div className="how-step">
            <div className="how-step-visual">
              <img src="/generated-assets/anukool_artisan_hands_crafting_1792356824138.jpg" alt="Make together" className="how-step-img" />
              <div className="how-step-num">2</div>
            </div>
            <h3>Make Together</h3>
            <p>Open the box and follow our photo-illustrated guide or scan the QR code for step-by-step artisan video instructions. All pre-cut materials and tools are included.</p>
          </div>
          <div className="how-step">
            <div className="how-step-visual">
              <img src="/generated-assets/anukool_hero_flatlay_1792356742487.jpg" alt="Gift with pride" className="how-step-img" />
              <div className="how-step-num">3</div>
            </div>
            <h3>Gift with Pride</h3>
            <p>Personalize the finished piece with names or dates, place it into the included gift box, and experience the unmatched pride of giving something made by your own hands.</p>
          </div>
        </div>

        <div style={{ background: '#f5eee3', borderRadius: 20, padding: '40px 36px', marginBottom: 50, border: '1px solid #e5ded2' }}>
          <div className="eyebrow muted" style={{ marginBottom: 14 }}>WHAT IS INSIDE EVERY ANUKOOL BOX</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[
              'Pre-cut authentic block-printed cotton panels',
              'Coordinating plain backing fabrics and linings',
              'High-grade craft cords, threads, and brass accents',
              'Safe non-toxic adhesives or self-adhesive backings',
              'Illustrated step-by-step instruction booklet',
              'Access to HD video tutorial by master artisans',
              'Premium gift-ready presentation box'
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#3f3a34', fontWeight: 600 }}>
                <Check size={16} style={{ color: '#2E3A8A', flexShrink: 0 }}/> {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>Ready to begin your hands-on journey?</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="button dark-button" onClick={onBack}>
              EXPLORE KITS NOW <ArrowUpRight size={16}/>
            </button>
            <button className="button" style={{ border: '1.5px solid #2E3A8A', color: '#2E3A8A', background: 'transparent' }} onClick={() => onNavigate('faq')}>
              READ FREQUENT QUESTIONS <ArrowUpRight size={16}/>
            </button>
          </div>
        </div>
      </div>
      <AnukoolPageFooter onNavigate={onNavigate} />
    </div>
  );
}


export default HowItWorksPage;
