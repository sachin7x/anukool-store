import React from "react";
import { ArrowUpRight } from "lucide-react";
import { AnukoolPageHeader, AnukoolPageFooter } from "../components/AnukoolLayout";

function OurStoryPage({ onBack, onNavigate }) {
  return (
    <div className="anukool-page">
      <AnukoolPageHeader onBack={onBack} />
      <div className="anukool-page-hero">
        <div className="wrap">
          <div className="eyebrow">✦ OUR ROOTS & PHILOSOPHY</div>
          <h1>अनुकूल — Crafted for Connection</h1>
          <p>From Jaipur's historic artisan workshops to your hands: the story of a brand bridging Indian textile heritage with the heartfelt joy of making.</p>
        </div>
      </div>
      <div className="wrap">
        <div className="story-grid">
          <div className="story-visual">
            <img src="/generated-assets/anukool_artisan_hands_crafting_1792356824138.jpg" alt="Artisan hands block printing in Jaipur" className="story-img" />
          </div>
          <div className="story-copy">
            <div className="eyebrow muted">WHERE IT ALL BEGINS</div>
            <h2>The Heritage of Jaipur</h2>
            <p>In the historic alleys of Sanganer and Bagru outside Jaipur, artisan families have practiced the meditative art of wooden block printing for over three centuries. Hand-carved teakwood blocks dip into natural dyes, rhythmic thumps echo in open courtyards, and vibrant textiles dry in the desert sun.</p>
            <p>Every print carries human touch — the slight, beautiful variations that machine prints can never replicate.</p>
          </div>
        </div>

        <div className="story-grid">
          <div className="story-copy">
            <div className="eyebrow muted">THE DILEMMA OF MODERN GIFTING</div>
            <h2>Making Gifts Meaningful Again</h2>
            <p>In a world of mass-produced, one-click purchases, gifting has often lost its soul. We give things out of obligation rather than connection. Yet people yearn for gifts that embody time, thoughtfulness, and personal warmth.</p>
            <p>Anukool was founded with a singular purpose: to enable anyone, regardless of craft skill, to create a stunning, personalized gift that carries their own care and creativity.</p>
          </div>
          <div className="story-visual">
            <img src="/generated-assets/anukool_hero_flatlay_1792356742487.jpg" alt="Handcrafted Anukool gift craft box" className="story-img" />
          </div>
        </div>

        <div className="story-grid">
          <div className="story-visual">
            <img src="/generated-assets/anukool_sku10_quarterly_craft_box_1792359715251.jpg" alt="V K Enterprises Jaipur workshop textiles" className="story-img" />
          </div>
          <div className="story-copy">
            <div className="eyebrow muted">OUR PARENTAGE</div>
            <h2>V K Enterprises, Jaipur</h2>
            <p>Anukool is proudly nurtured by V K Enterprises, an established textile house in Jaipur. We work directly with generational printers, cutters, and block-carvers, providing steady year-round income and preserving techniques at risk of extinction.</p>
            <p>When you purchase an Anukool kit, your hands directly support master artisan families in Rajasthan.</p>
          </div>
        </div>

        <div style={{ padding: '60px 0 30px' }}>
          <div className="section-heading">
            <div>
              <div className="eyebrow muted">GENERATIONS OF MASTERY</div>
              <h2>Meet our artisan partners</h2>
            </div>
          </div>
          <div className="artisan-grid">
            {[
              { image: '/images/avatar3.jpg', name: 'Ramesh Ji Saini', skill: 'Master Block Printer (38 years)', desc: 'Ramesh Ji hand-stamps the intricate mandala and paisley patterns featured in our Diwali and Gratitude journal kits.' },
              { image: '/images/avatar1.jpg', name: 'Sunita Devi', skill: 'Natural Fabric Specialist', desc: 'Sunita Devi oversees pure cotton sourcing, natural desizing, and pre-cut precision for our festival series.' },
              { image: '/images/avatar2.jpg', name: 'Mohan Lal Verma', skill: 'Pattern & Finishing Craftsman', desc: 'Mohan Lal ensures each fabric panel, cord, and tassel is dimensionally calibrated so your assembly is effortless.' }
            ].map(a => (
              <div className="artisan-card" key={a.name}>
                <div className="artisan-avatar">
                  <img src={a.image} alt={a.name} className="artisan-photo" />
                </div>
                <h4>{a.name}</h4>
                <p style={{ fontWeight: 800, fontSize: 10, color: '#C75B39', marginBottom: 10, letterSpacing: '.05em' }}>{a.skill}</p>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#eef2fb', borderRadius: 20, padding: '44px 36px', margin: '40px 0 60px', border: '1px solid #d5dfef' }}>
          <div className="eyebrow" style={{ color: '#2E3A8A', marginBottom: 12 }}>OUR ETHICAL PROMISE</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: '#2E3A8A', margin: '0 0 16px' }}>Zero Plastic Waste & Refill-Ready</h2>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: '#455068', maxWidth: 740, margin: 0 }}>
            Every Anukool kit utilizes pure breathable cottons, recycled board packaging, and water-based non-toxic inks. Our Refill Program lets you reuse base hardware and tools forever, reducing waste and encouraging a lifetime of handmade making.
          </p>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <button className="button dark-button" onClick={onBack}>
            EXPLORE THE KITS <ArrowUpRight size={16}/>
          </button>
        </div>
      </div>
      <AnukoolPageFooter onNavigate={onNavigate} />
    </div>
  );
}


export default OurStoryPage;
