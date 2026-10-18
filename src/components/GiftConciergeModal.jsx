import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ArrowUpRight, ShieldCheck, Heart, ShoppingBag } from 'lucide-react';
import { evaluateGiftIntent } from '../lib/typesafe';
import { money } from '../lib/utils';

export default function GiftConciergeModal({
  isOpen,
  onClose,
  catalog,
  onSelectProduct,
  onAddToCart
}) {
  const [prompt, setPrompt] = useState('Diwali gift for family under ₹1000 with block-printed fabric');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const samplePrompts = [
    'Diwali gift for family under ₹1000',
    'Rakhi surprise for creative sibling',
    'Relaxing mindful evening for beginner',
    'Eco-friendly home decor under ₹700'
  ];

  async function handleSearch(queryText) {
    const q = queryText !== undefined ? queryText : prompt;
    if (!q || !q.trim()) return;
    setLoading(true);
    try {
      const evaluation = await evaluateGiftIntent(q, catalog);
      setResults(evaluation);
    } catch (e) {
      console.error('Gift concierge evaluation error:', e);
    } finally {
      setLoading(false);
    }
  }

  // Run initial search when modal opens
  useEffect(() => {
    if (isOpen && !results && catalog && catalog.length > 0) {
      handleSearch(prompt);
    }
  }, [isOpen, catalog]);

  // Handle escape key listener inside modal
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-backdrop" onClick={onClose}>
      <section
        className="checkout-modal gift-concierge-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Anukool AI Gift Concierge"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 680, width: '92%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="drawer-heading" style={{ borderBottom: '1px solid #e8e1d7', paddingBottom: 16 }}>
          <div>
            <div className="eyebrow" style={{ color: '#D4AF37', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} /> TYPESAFE SYSTEM ONE (JEV)
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, margin: '4px 0 0', color: '#2E3A8A' }}>
              Gift Concierge
            </h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close gift concierge">
            <X size={20} />
          </button>
        </div>

        <div style={{ marginTop: 18 }}>
          <p style={{ fontSize: 13, color: '#555', margin: '0 0 12px' }}>
            Describe who you are making or gifting for. TypeSafe Jev evaluates semantic resonance, budget boundaries, and craft complexity.
          </p>

          <form
            onSubmit={e => {
              e.preventDefault();
              handleSearch();
            }}
            style={{ display: 'flex', gap: 8, marginBottom: 12 }}
          >
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Mindful relaxing Diwali gift for mom under ₹1000..."
              aria-label="Gift recipient description"
              style={{
                flex: 1,
                padding: '12px 14px',
                border: '1.5px solid #2E3A8A',
                borderRadius: 8,
                fontSize: 13,
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              className="button dark-button"
              disabled={loading}
              style={{ background: '#2E3A8A', whiteSpace: 'nowrap', padding: '0 20px' }}
            >
              {loading ? 'ANALYZING…' : 'MATCH KITS'}
            </button>
          </form>

          {/* Prompt Presets */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {samplePrompts.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPrompt(p);
                  handleSearch(p);
                }}
                style={{
                  background: prompt === p ? '#2E3A8A' : '#EEF0F8',
                  color: prompt === p ? '#fff' : '#2E3A8A',
                  border: 0,
                  borderRadius: 16,
                  padding: '5px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Results Display */}
          {results && (
            <div>
              {/* TypeSafe Judgment Badges */}
              <div
                style={{
                  background: '#F8F4E9',
                  border: '1px solid #e8e1d7',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  fontSize: 11
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ShieldCheck size={14} style={{ color: '#2E3A8A' }} />
                  <span>
                    <strong>Budget Noul:</strong> {results.budgetFit.satisfied ? 'Satisfied' : 'Exceeded'}{' '}
                    (P = {results.budgetFit.probability})
                  </span>
                </div>
                <div>
                  <strong>Score:</strong> {'★'.repeat(results.sentimentScore.score)} {results.sentimentScore.label}
                </div>
                <div style={{ color: '#666' }}>
                  ⚡ {results.latencyMs}ms System One latency
                </div>
              </div>

              {/* Recommendations List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {results.topPicks.map((kit, idx) => (
                  <div
                    key={kit.id}
                    style={{
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center',
                      background: idx === 0 ? '#FEFBF5' : '#fff',
                      border: idx === 0 ? '1.5px solid #D4AF37' : '1px solid #e8e1d7',
                      borderRadius: 12,
                      padding: 14,
                      position: 'relative'
                    }}
                  >
                    {idx === 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -10,
                          left: 16,
                          background: '#D4AF37',
                          color: '#1a2060',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: '0.05em'
                        }}
                      >
                        ✦ HIGHEST JEV CHOICE RESONANCE ({Math.round(kit.choiceProbability * 100)}%)
                      </div>
                    )}
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 8,
                        background: kit.color || '#EEF0F8',
                        overflow: 'hidden',
                        flexShrink: 0,
                        display: 'grid',
                        placeItems: 'center'
                      }}
                    >
                      {kit.image ? (
                        <img
                          src={kit.image}
                          alt={kit.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ fontSize: 32 }}>{kit.emoji}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: '#6B8E23',
                            background: '#F0FDF4',
                            padding: '2px 6px',
                            borderRadius: 4
                          }}
                        >
                          {kit.category}
                        </span>
                        <span style={{ fontSize: 11, color: '#666' }}>{kit.craftTime}</span>
                      </div>
                      <h4
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 15,
                          margin: '4px 0 2px',
                          color: '#2E3A8A'
                        }}
                      >
                        {kit.name}
                      </h4>
                      <p style={{ fontSize: 11, color: '#666', margin: '0 0 6px', lineHeight: 1.4 }}>
                        {kit.description?.slice(0, 85)}…
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 14, color: '#2E3A8A' }}>{money(kit.price)}</strong>
                        <span style={{ fontSize: 11, textDecoration: 'line-through', color: '#999' }}>
                          {money(kit.mrp)}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                      <button
                        className="button dark-button"
                        onClick={() => {
                          onAddToCart(kit.id, 1);
                        }}
                        style={{
                          background: '#2E3A8A',
                          fontSize: 10,
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <ShoppingBag size={12} /> ADD TO BAG
                      </button>
                      <button
                        onClick={() => {
                          onSelectProduct(kit);
                          onClose();
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #2E3A8A',
                          color: '#2E3A8A',
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '6px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        VIEW DETAILS →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
