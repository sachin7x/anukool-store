import React, { useState } from "react";
import {
  ArrowLeft, ShoppingBag, Paintbrush, ShieldCheck, Truck, Share2,
  Check, Heart, ArrowUpRight, Play, Star, ChevronDown, Plus, Minus
} from "lucide-react";
import { money } from "../lib/utils";
import { ProductCard } from "../components/ProductCard";
import { AnukoolPageFooter } from "../components/AnukoolLayout";
import ReviewModal from "../components/ReviewModal";

function ProductPage({
  product: p, products, onBack, onAddToCart, onBuyNow,
  onSelectRelated, isWishlisted, onToggleWishlist, cartCount, onOpenCart, currency = 'INR'
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState(p.video ? 'video' : 'story');
  const [copied, setCopied] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const all = JSON.parse(localStorage.getItem('ank_reviews') || '[]');
      return all.filter(r => r.productId === p.id);
    } catch {
      return [];
    }
  });

  const gallery = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
  const currentImg = gallery[activeImgIndex] || gallery[0] || null;

  const related = products.filter(item => item.id !== p.id && item.category === p.category).slice(0, 4);

  function shareKit() {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="product-page">
      <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <a className="brand" href="#" onClick={e => { e.preventDefault(); onBack(); }}>
          anu<span>kool</span><i>.</i>
        </a>
        <div className="header-actions">
          <button className="page-back-btn" onClick={onBack}>
            <ArrowLeft size={14}/> ALL KITS
          </button>
          <button className="bag-button" onClick={onOpenCart}>
            <ShoppingBag size={16}/> BAG <span>{cartCount}</span>
          </button>
        </div>
      </header>

      <div className="wrap">
        <nav className="product-breadcrumbs" aria-label="Breadcrumb">
          <button onClick={onBack}>Store</button>
          <span>/</span>
          <button onClick={onBack}>{p.category}</button>
          <span>/</span>
          <b>{p.name}</b>
        </nav>

        <section className="product-hero-layout">
          {/* Gallery Column */}
          <div className="product-gallery">
            <div className="product-gallery-main" style={{ background: p.color }}>
              <span className="product-gallery-badge">{p.tag || 'Craft Kit'}</span>
              {currentImg ? (
                <img src={currentImg} alt={p.name} />
              ) : (
                <span className="product-gallery-emoji">{p.emoji}</span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="product-thumbs">
                {gallery.map((img, i) => (
                  <button
                    key={img + i}
                    className={`product-thumb-btn ${activeImgIndex === i ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(i)}
                  >
                    <img src={img} alt={`Angle ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {p.video && (
              <button
                className="watch-video-btn"
                onClick={() => {
                  setActiveTab('video');
                  document.querySelector('.product-deep-dive')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  marginTop: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 18px',
                  background: 'var(--anukool-indigo, #2E3A8A)',
                  color: '#fff',
                  border: 0,
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: 'fit-content'
                }}
              >
                <Play size={14} fill="currentColor" /> WATCH MAKING REEL (HD)
              </button>
            )}

            <div className="trust-row" style={{ padding: '16px 0 0', justifyContent: 'flex-start', gap: 20 }}>
              <div><Paintbrush/><span>Jaipur Handcraft</span></div>
              <div><ShieldCheck/><span>Pre-tested Guide</span></div>
              <div><Truck/><span>Dispatches in 24h</span></div>
            </div>
          </div>

          {/* Info Column */}
          <div className="product-info-panel">
            <span className="product-tag-pill">{p.category}</span>
            <h1>{p.name}</h1>

            <div className="product-review-summary">
              <span className="stars">★★★★★</span>
              <span>{Number(p.rating || 4.8).toFixed(1)}</span>
              <small>({p.reviewsCount || 120} verified makers)</small>
              <button
                onClick={shareKit}
                style={{ marginLeft: 'auto', background: 'none', border: 0, color: '#777', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}
              >
                <Share2 size={13}/> {copied ? 'Link Copied!' : 'Share kit'}
              </button>
            </div>

            <div className="product-pricing-card">
              <div className="product-price-line">
                <strong>{money(p.price, currency)}</strong>
                {p.mrp && p.mrp > p.price && (
                  <>
                    <span className="mrp">{money(p.mrp, currency)}</span>
                    <span className="save-pill">Save {money(p.mrp - p.price, currency)}</span>
                  </>
                )}
              </div>
              <div className="product-tax-note">All taxes included. Free Pan-India shipping above ₹999.</div>
            </div>

            <p className="product-description-lead">{p.description}</p>

            <div className="product-perks-checklist">
              <div><Check size={16}/> Everything needed included — no extra trips to craft shops</div>
              <div><Check size={16}/> Handcrafted block-printed Jaipur pure cotton panels</div>
              <div><Check size={16}/> Illustrated step-by-step guidebook & HD artisan video link</div>
            </div>

            <div className="detail-stock" style={{ margin: 0 }}>
              <span className={p.stock > 0 ? 'stock-dot' : 'stock-dot out'}/>
              {p.stock > 0 ? (
                p.stock < 15 ? `Only ${p.stock} kits remaining in this artisan batch` : 'In stock — ready to ship from Jaipur workshop'
              ) : (
                'Currently handcrafting next batch'
              )}
            </div>

            <div className="product-purchase-row">
              <div className="product-qty-selector">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus size={13}/></button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(p.stock || 99, qty + 1))} disabled={qty >= p.stock} aria-label="Increase quantity"><Plus size={13}/></button>
              </div>

              <button className="button dark-button product-add-cart-btn" onClick={() => onAddToCart(qty)}>
                ADD TO BAG · {money(p.price * qty, currency)}
              </button>

              <button className="button product-buy-now-btn" onClick={() => onBuyNow(qty)}>
                BUY NOW <ArrowUpRight size={15}/>
              </button>

              <button
                className={`product-wish-btn ${isWishlisted ? 'saved' : ''}`}
                onClick={onToggleWishlist}
                title={isWishlisted ? 'Remove from wishlist' : 'Save for later'}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'}/>
              </button>
            </div>

            <div className="product-delivery-estimate">
              <Truck size={17} style={{ color: '#2E3A8A', flexShrink: 0 }}/>
              <span>Enter your PIN code at checkout for express delivery (3–5 business days across India).</span>
            </div>
          </div>
        </section>

        {/* Deep Dive Tabs */}
        <section className="product-deep-dive">
          <div className="product-tabs-nav">
            {p.video && (
              <button className={`product-tab-link ${activeTab === 'video' ? 'active' : ''}`} onClick={() => setActiveTab('video')}>
                Watch Making Video 📹
              </button>
            )}
            <button className={`product-tab-link ${activeTab === 'story' ? 'active' : ''}`} onClick={() => setActiveTab('story')}>
              The Craft Experience
            </button>
            <button className={`product-tab-link ${activeTab === 'box' ? 'active' : ''}`} onClick={() => setActiveTab('box')}>
              What's in the Box
            </button>
            <button className={`product-tab-link ${activeTab === 'how' ? 'active' : ''}`} onClick={() => setActiveTab('how')}>
              How to Make It
            </button>
            <button className={`product-tab-link ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>
              Specifications
            </button>
          </div>

          <div className="product-tab-panel">
            {p.video && activeTab === 'video' && (
              <div>
                <h3>Watch how it comes together</h3>
                <p>See a real maker unbox and craft this project step-by-step:</p>
                <div className="product-video-preview">
                  <video src={p.video} poster={p.image} controls playsInline />
                </div>
              </div>
            )}

            {activeTab === 'story' && (
              <div>
                <h3>Crafted with intention in Jaipur</h3>
                <p>
                  Every fabric panel in this kit is hand-stamped using traditional wooden blocks by master artisans in Sanganer, Jaipur. Unlike mass-produced decor, this kit turns an ordinary weekend evening into a calm, grounding ritual of making.
                </p>
                <p>
                  Whether you are crafting alone to unwind, pairing up for a memorable date night, or making a heartfelt gift for a festival, the tactile pleasure of pure Indian cotton and mindful assembly makes the finished piece uniquely yours.
                </p>
              </div>
            )}

            {activeTab === 'box' && (
              <div>
                <h3>Everything you need is packed inside</h3>
                <p>No unexpected missing tools. We pack every single necessary piece so you can begin making right out of the presentation box:</p>
                <div className="components-pill-list">
                  {(p.components || 'Pre-cut fabric panels, Coordinating threads, Embellishments, Illustrated instructions, Gift box')
                    .split(',')
                    .map((item, idx) => (
                      <div className="component-item-pill" key={item + idx}>
                        <Check size={16}/> {item.trim()}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'how' && (
              <div>
                <h3>Three simple steps to completion</h3>
                <div className="how-steps" style={{ padding: '16px 0 0' }}>
                  <div className="how-step">
                    <div className="how-step-num">1</div>
                    <h3>Unbox & Prep</h3>
                    <p>Lay out your pre-cut block-printed panels and accessories on a flat table. Scan the booklet QR code to watch our artisan video guide.</p>
                  </div>
                  <div className="how-step">
                    <div className="how-step-num">2</div>
                    <h3>Assemble & Embellish</h3>
                    <p>Follow the numbered photo diagrams to shape and stitch the fabric panels. Add mirrors, charms, or custom initial patches.</p>
                  </div>
                  <div className="how-step">
                    <div className="how-step-num">3</div>
                    <h3>Illuminate or Gift</h3>
                    <p>Turn on the warm tea light or pack your finished handmade masterpiece into the included gift box to delight someone special.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h3>Kit Specifications</h3>
                <table className="product-specs-table">
                  <tbody>
                    <tr><td>Materials</td><td>{p.materials || '100% Cotton, Natural dyes, Recycled paper'}</td></tr>
                    <tr><td>Dimensions</td><td>{p.dimensions || 'Standard craft kit proportions'}</td></tr>
                    <tr><td>Artisan Provenance</td><td>Jaipur, Rajasthan (V K Enterprises partnership)</td></tr>
                    <tr><td>Craft Time</td><td>{p.craftTime || '45–60 minutes'}</td></tr>
                    <tr><td>Skill Level</td><td>{p.difficulty || 'Beginner Friendly (Zero prior experience)'}</td></tr>
                    <tr><td>Customization</td><td>{p.customization || 'Personalizable with initials or dates'}</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section style={{ margin: '40px 0 60px' }}>
          <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="eyebrow muted">VERIFIED MAKER REVIEWS</div>
              <h2>Loved by hands across India.</h2>
            </div>
            <button
              className="button dark-button"
              onClick={() => setShowReviewModal(true)}
              style={{ background: '#2E3A8A', color: '#fff', fontSize: 11, padding: '10px 18px' }}
            >
              + WRITE A REVIEW
            </button>
          </div>

          <div className="reviews-grid">
            {reviewsList.map(r => (
              <div className="review-card" key={r.id} style={{ border: '2px solid #D4AF37' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="stars" style={{ color: '#D4AF37' }}>
                    {"★".repeat(r.rating || 5)}{"☆".repeat(5 - (r.rating || 5))}
                  </div>
                  <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                    {r.craftExperience || 'Maker'}
                  </span>
                </div>
                {r.title && <h4 style={{ margin: '8px 0 4px', fontSize: 14, color: '#2E3A8A' }}>{r.title}</h4>}
                <p>"{r.body}"</p>
                {r.photo && (
                  <div style={{ margin: '10px 0' }}>
                    <img
                      src={r.photo}
                      alt="Maker's finished craft"
                      style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8, border: '1px solid #e8e1d7' }}
                    />
                  </div>
                )}
                <div className="review-author">
                  <strong>{r.author} {r.city ? `(${r.city})` : ''}</strong>
                  <span className="review-verified"><Check size={12}/> Verified Maker</span>
                </div>
              </div>
            ))}

            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"I made this for my sister on Rakhi and she actually teared up. The quality of the block-printed cotton is stunning and the instructions were so clear."</p>
              <div className="review-author">
                <strong>Ananya Joshi (Pune)</strong>
                <span className="review-verified"><Check size={12}/> Verified Maker</span>
              </div>
            </div>

            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"A wonderful couples activity! We put on some music and completed our fabric diyas together in an hour. Looks gorgeous on our dining table."</p>
              <div className="review-author">
                <strong>Vikram & Neha (Bengaluru)</strong>
                <span className="review-verified"><Check size={12}/> Verified Maker</span>
              </div>
            </div>

            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"The packaging was so premium. Everything felt intentional, from the natural cotton scent to the little brass charms. Will definitely order again!"</p>
              <div className="review-author">
                <strong>Pooja Deshmukh (Jaipur)</strong>
                <span className="review-verified"><Check size={12}/> Verified Maker</span>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Grid */}
        {related.length > 0 && (
          <section style={{ margin: '40px 0 80px' }}>
            <div className="section-heading">
              <div>
                <div className="eyebrow muted">COMPLETE THE OCCASION</div>
                <h2>You might also love</h2>
              </div>
              <button className="text-link" onClick={onBack}>VIEW ALL KITS <ArrowUpRight size={14}/></button>
            </div>
            <div className="product-grid">
              {related.map(item => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onAdd={() => onAddToCart(1)}
                  onOpen={() => onSelectRelated(item)}
                  saved={false}
                  onSave={() => {}}
                  currency={currency}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <AnukoolPageFooter onNavigate={pageKey => {
        if (pageKey === 'store') onBack();
        else window.location.hash = pageKey;
      }} />

      {showReviewModal && (
        <ReviewModal
          product={p}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={(newRev) => {
            setReviewsList(prev => [newRev, ...prev]);
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  );
}

export default ProductPage;
