import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, RotateCcw, Download, ArrowUpRight, Check, Palette } from 'lucide-react';

const MOTIFS = [
  { id: 'boota', name: 'Jaipur Paisley', symbol: '🪡', svgPath: 'paisley' },
  { id: 'lotus', name: 'Royal Lotus', symbol: '🪷', svgPath: 'lotus' },
  { id: 'elephant', name: 'Royal Elephant', symbol: '🐘', svgPath: 'elephant' },
  { id: 'mandala', name: 'Suraj Mandala', symbol: '☀️', svgPath: 'mandala' },
  { id: 'vine', name: 'Sanganer Vine', symbol: '🌿', svgPath: 'vine' }
];

const COLORS = [
  { name: 'Jaipur Indigo', hex: '#2E3A8A' },
  { name: 'Sanganeri Terracotta', hex: '#C75B39' },
  { name: 'Marigold Gold', hex: '#D4AF37' },
  { name: 'Malachite Emerald', hex: '#1E6F50' },
  { name: 'Kohl Charcoal', hex: '#2A2A2A' }
];

export default function BlockPrintSimulatorModal({ isOpen, onClose, onExploreKits }) {
  const canvasRef = useRef(null);
  const [selectedMotif, setSelectedMotif] = useState(MOTIFS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [stampsCount, setStampsCount] = useState(0);

  // Initialize canvas with organic cotton slub texture
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = canvas.parentElement.clientWidth || 560);
    const height = (canvas.height = 360);

    // Warm organic cotton canvas background
    ctx.fillStyle = '#F8F4E9';
    ctx.fillRect(0, 0, width, height);

    // Subtle fabric slub lines
    ctx.strokeStyle = 'rgba(232, 225, 215, 0.45)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [isOpen]);

  // Handle escape key listener
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  function handleCanvasClick(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');

    // Draw handcrafted stamp with natural artisan micro-variations
    ctx.save();
    ctx.translate(x, y);

    // Micro rotation angle (-4 to +4 deg) simulating hand placement
    const angle = (Math.random() - 0.5) * 0.14;
    ctx.rotate(angle);

    // Hand-press opacity variation (0.75 - 0.95)
    ctx.globalAlpha = 0.8 + Math.random() * 0.18;
    ctx.fillStyle = selectedColor.hex;

    drawMotif(ctx, selectedMotif.id);

    ctx.restore();
    setStampsCount(prev => prev + 1);
  }

  function drawMotif(ctx, motifId) {
    ctx.beginPath();
    if (motifId === 'boota') {
      // Paisley tear curve
      ctx.arc(0, 6, 16, 0, Math.PI);
      ctx.bezierCurveTo(-16, -10, -4, -26, 8, -32);
      ctx.bezierCurveTo(4, -18, 16, -4, 16, 6);
      ctx.fill();

      // Inner ornate dot
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 6, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (motifId === 'lotus') {
      // Lotus petals
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(i * 9, 0, 7, 20, (i * 15 * Math.PI) / 180, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 14, 18, Math.PI, 0);
      ctx.fill();
    } else if (motifId === 'elephant') {
      // Elephant silhouette
      ctx.arc(0, -2, 18, 0, Math.PI * 2);
      ctx.rect(-14, 4, 8, 18);
      ctx.rect(6, 4, 8, 18);
      ctx.rect(-22, -8, 8, 20); // trunk
      ctx.fill();
    } else if (motifId === 'mandala') {
      // Radial sunburst
      for (let i = 0; i < 12; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 6);
        ctx.fillRect(-3, -24, 6, 14);
        ctx.restore();
      }
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Sanganer floral vine
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.ellipse(-14, -14, 6, 12, -Math.PI / 4, 0, Math.PI * 2);
      ctx.ellipse(14, -14, 6, 12, Math.PI / 4, 0, Math.PI * 2);
      ctx.ellipse(-14, 14, 6, 12, Math.PI / 4, 0, Math.PI * 2);
      ctx.ellipse(14, 14, 6, 12, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#F8F4E9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStampsCount(0);
  }

  function downloadCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `anukool-jaipur-blockprint-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-backdrop" onClick={onClose}>
      <section
        className="checkout-modal block-print-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Jaipur Hand Block-Printing Simulator"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 680, width: '94%', maxHeight: '92vh', overflowY: 'auto' }}
      >
        <div className="drawer-heading" style={{ borderBottom: '1px solid #e8e1d7', paddingBottom: 14 }}>
          <div>
            <div className="eyebrow" style={{ color: '#D4AF37', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} /> JAIPUR ARTISAN STUDIO
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: '4px 0 0', color: '#2E3A8A' }}>
              Hand Block-Print Studio
            </h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close studio">
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: 13, color: '#555', margin: '14px 0 16px', lineHeight: 1.6 }}>
          Experience the meditative art of Jaipur block printing. Select an authentic wooden block motif and mineral ink, then click the cotton canvas to press your print.
        </p>

        {/* Motif Selector */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', color: '#2E3A8A', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            1. Select Carved Wooden Block
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {MOTIFS.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMotif(m)}
                style={{
                  background: selectedMotif.id === m.id ? '#2E3A8A' : '#EEF0F8',
                  color: selectedMotif.id === m.id ? '#fff' : '#2E3A8A',
                  border: selectedMotif.id === m.id ? '1px solid #2E3A8A' : '1px solid #d4daf2',
                  borderRadius: 10,
                  padding: '8px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <span>{m.symbol}</span>
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mineral Color Selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', color: '#2E3A8A', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            2. Choose Natural Dye Shade
          </label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {COLORS.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 10px',
                  borderRadius: 99,
                  border: selectedColor.name === c.name ? `2px solid ${c.hex}` : '1px solid #e8e1d7',
                  background: selectedColor.name === c.name ? '#fff' : '#fafaf7',
                  cursor: 'pointer'
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: c.hex, display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#333' }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cotton Fabric Canvas */}
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1.5px solid #dcd3c4', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)' }}>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{ width: '100%', height: 320, display: 'block', cursor: 'crosshair', background: '#F8F4E9' }}
          />
          {stampsCount === 0 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                pointerEvents: 'none',
                color: '#8b8374',
                fontSize: 13,
                fontStyle: 'italic',
                background: 'rgba(248, 244, 233, 0.4)'
              }}
            >
              ✦ Click anywhere on the fabric to stamp your block pattern ✦
            </div>
          )}
        </div>

        {/* Studio Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="button"
              onClick={clearCanvas}
              style={{ background: 'transparent', border: '1px solid #bbb', color: '#555', fontSize: 11, padding: '7px 12px' }}
            >
              <RotateCcw size={13} /> RESET FABRIC
            </button>
            {stampsCount > 0 && (
              <button
                className="button"
                onClick={downloadCanvas}
                style={{ background: 'transparent', border: '1px solid #2E3A8A', color: '#2E3A8A', fontSize: 11, padding: '7px 12px' }}
              >
                <Download size={13} /> SAVE DESIGN
              </button>
            )}
          </div>

          <button
            className="button dark-button"
            onClick={() => {
              onClose();
              onExploreKits();
            }}
            style={{ background: '#2E3A8A', fontSize: 11, padding: '8px 16px' }}
          >
            ORDER THIS BLOCK-PRINT KIT <ArrowUpRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
