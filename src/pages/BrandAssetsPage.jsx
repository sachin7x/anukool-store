import React, { useState } from "react";
import { Download, Check, Copy, ArrowUpRight, Mail, Sparkles, Palette, FileText, ShieldCheck, DownloadCloud } from "lucide-react";
import { AnukoolPageHeader, AnukoolPageFooter } from "../components/AnukoolLayout";

export default function BrandAssetsPage({ onBack, onNavigate }) {
  const [copiedColor, setCopiedColor] = useState(null);
  const [copiedBoilerplate, setCopiedBoilerplate] = useState(false);

  const colors = [
    { name: "Jaipur Indigo", hex: "#2E3A8A", role: "Primary brand & wordmark", light: false },
    { name: "Terracotta Warm", hex: "#C75B39", role: "Accent dot & festive craft", light: false },
    { name: "Silk Linen Cream", hex: "#F8F4E9", role: "Page backgrounds & surfaces", light: true },
    { name: "Heritage Gold", hex: "#D4AF37", role: "Decorative borders & stars", light: true },
    { name: "Sanganer Sage", hex: "#68865D", role: "Botanical kits & craft details", light: false },
    { name: "Charcoal Stamp", hex: "#1A1A1A", role: "Text & crisp contours", light: false }
  ];

  const boilerplateText =
    "Anukool (अनुकूल) is India's premier artisanal DIY craft-kit brand by V K Enterprises, Jaipur. Founded in Jaipur's historic textile quarters, it crafts all-inclusive do-it-yourself block-printing and fabric craft kits—curated for festive gifting, date nights, mindful living, and creative connection. Spanning 22 signature kits across traditional hand block-printing, festive diyas, miniature canvases, and botanical creations, Anukool brings centuries-old artisan traditions directly to your hands with all-inclusive materials, natural vegetable dyes, and zero-experience illustrated guides. More than 12,000 makers across India have experienced the joy of making something with an Anukool box.";

  const handleCopyColor = (hex) => {
    navigator.clipboard?.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleCopyBoilerplate = () => {
    navigator.clipboard?.writeText(boilerplateText);
    setCopiedBoilerplate(true);
    setTimeout(() => setCopiedBoilerplate(false), 2500);
  };

  return (
    <div className="anukool-page">
      <AnukoolPageHeader onBack={onBack} />

      {/* Hero Section */}
      <section className="kprs__hero">
        <div className="wrap kprs__hero-inner">
          <div className="kprs__hero-copy">
            <span className="eyebrow" style={{ color: "#D4AF37", marginBottom: 12 }}>
              <Sparkles size={14} style={{ marginRight: 6 }} /> PRESS &amp; MEDIA KIT
            </span>
            <h1 className="kprs__title">
              Brand <em>Assets</em> &amp; Media Kit
            </h1>
            <p className="kprs__lede">
              Jaipur's premier artisanal DIY craft kit brand by V K Enterprises. Everything editors, creators, and partners need — official logos, color palette, typography guidelines, and company facts.
            </p>
            <div className="kprs__hero-cta">
              <a href="mailto:hello@anukool.in" className="button dark-button" style={{ background: "#C75B39" }}>
                <Mail size={16} /> Contact hello@anukool.in
              </a>
              <a href="#brand-assets" className="button" style={{ background: "transparent", border: "1px solid #D4AF37", color: "#F8F4E9" }}>
                <DownloadCloud size={16} /> Download Brand Assets
              </a>
            </div>
          </div>
          <div className="kprs__hero-badge">
            <div className="kprs__hero-badge-inner">
              <span className="kprs__badge-sanskrit">अनुकूल</span>
              <span className="kprs__badge-subtitle">CRAFTED FOR CONNECTION</span>
              <span className="kprs__badge-origin">JAIPUR ✦ RAJASTHAN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Facts Strip */}
      <section className="kprs__facts-strip">
        <div className="wrap">
          <div className="kprs__facts-grid">
            <div className="kprs__fact-card">
              <span className="kprs__fact-num">2024</span>
              <span className="kprs__fact-label">Founded in Jaipur</span>
              <span className="kprs__fact-sub">Rooted in 40+ yr textile heritage</span>
            </div>
            <div className="kprs__fact-card">
              <span className="kprs__fact-num">22</span>
              <span className="kprs__fact-label">Handcrafted DIY Kits</span>
              <span className="kprs__fact-sub">Block-print, pottery, art &amp; food</span>
            </div>
            <div className="kprs__fact-card">
              <span className="kprs__fact-num">12,000+</span>
              <span className="kprs__fact-label">Makers &amp; Gifters</span>
              <span className="kprs__fact-sub">4.9/5 stars average review</span>
            </div>
            <div className="kprs__fact-card">
              <span className="kprs__fact-num">19,000+</span>
              <span className="kprs__fact-label">PIN Codes Served</span>
              <span className="kprs__fact-sub">Pan-India express delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Brand Assets Grid */}
      <section className="kprs__assets-section" id="brand-assets">
        <div className="wrap">
          <div className="kprs__section-header">
            <span className="eyebrow muted">OFFICIAL MARKS</span>
            <h2>Logo &amp; Brand Guidelines</h2>
            <p className="kprs__sub">
              Please use these vector and high-resolution marks as supplied. Do not recolor, distort, stretch, or alter the Sanskrit wordmark elements.
            </p>
          </div>

          <div className="kprs__logos-grid">
            {/* Primary Lockup */}
            <div className="kprs__logo-card kprs__logo-card--light">
              <div className="kprs__logo-preview" style={{ background: "#F8F4E9" }}>
                <img
                  src="/anukool-assets/anukool-logo-primary.svg"
                  alt="Anukool Primary Logo Lockup"
                  style={{ maxWidth: 300, width: "100%", height: "auto" }}
                />
              </div>
              <div className="kprs__logo-meta">
                <div>
                  <h3 className="kprs__logo-name">Primary Lockup</h3>
                  <p className="kprs__logo-desc">For light, cream, linen, and clean photographic backgrounds.</p>
                </div>
                <div className="kprs__logo-actions">
                  <a
                    href="/anukool-assets/anukool-logo-primary.svg"
                    download="anukool-logo-primary.svg"
                    className="kprs__dl-btn"
                  >
                    <Download size={14} /> SVG
                  </a>
                  <a
                    href="/anukool-hero.svg"
                    download="anukool-hero.svg"
                    className="kprs__dl-btn is-outline"
                  >
                    <Download size={14} /> Vector Hero
                  </a>
                </div>
              </div>
            </div>

            {/* Reversed Lockup */}
            <div className="kprs__logo-card kprs__logo-card--dark">
              <div className="kprs__logo-preview" style={{ background: "#2E3A8A" }}>
                <img
                  src="/anukool-assets/anukool-logo-reversed.svg"
                  alt="Anukool Reversed Logo Lockup"
                  style={{ maxWidth: 300, width: "100%", height: "auto" }}
                />
              </div>
              <div className="kprs__logo-meta">
                <div>
                  <h3 className="kprs__logo-name">Reversed Lockup</h3>
                  <p className="kprs__logo-desc">For dark indigo, saturated color, and high-contrast media.</p>
                </div>
                <div className="kprs__logo-actions">
                  <a
                    href="/anukool-assets/anukool-logo-reversed.svg"
                    download="anukool-logo-reversed.svg"
                    className="kprs__dl-btn"
                  >
                    <Download size={14} /> SVG
                  </a>
                </div>
              </div>
            </div>

            {/* Square App Icon & Stamp Badge */}
            <div className="kprs__logo-card kprs__logo-card--badge">
              <div className="kprs__logo-preview" style={{ background: "#F4EFE6", display: "flex", gap: 24, alignItems: "center", justifyContent: "center" }}>
                <img
                  src="/anukool-assets/anukool-favicon.svg"
                  alt="Anukool Square Stamp Icon"
                  style={{ width: 88, height: 88 }}
                />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: "#2E3A8A" }}>
                    anu<span style={{ color: "#C75B39" }}>kool</span><i>.</i>
                  </div>
                  <div style={{ fontSize: 11, color: "#68865D", letterSpacing: "1px", fontWeight: 700 }}>
                    STAMP &amp; ICON MARK
                  </div>
                </div>
              </div>
              <div className="kprs__logo-meta">
                <div>
                  <h3 className="kprs__logo-name">Carved Stamp &amp; App Icon</h3>
                  <p className="kprs__logo-desc">Hand-carved wooden floral block motif for app icons, avatars, and favicons.</p>
                </div>
                <div className="kprs__logo-actions">
                  <a
                    href="/anukool-assets/anukool-favicon.svg"
                    download="anukool-favicon.svg"
                    className="kprs__dl-btn"
                  >
                    <Download size={14} /> SVG
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette & Typography Specifications */}
          <div className="kprs__specs-grid">
            {/* Color Swatches */}
            <div className="kprs__spec-card">
              <div className="kprs__spec-title-row">
                <Palette size={18} style={{ color: "#2E3A8A" }} />
                <h3>Color Palette</h3>
              </div>
              <p className="kprs__spec-lead">Click any hex swatch to copy directly to your clipboard:</p>
              <div className="kprs__swatches-list">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className="kprs__swatch-row"
                    onClick={() => handleCopyColor(c.hex)}
                  >
                    <span
                      className="kprs__swatch-chip"
                      style={{ background: c.hex, border: c.light ? "1px solid #dcd3c4" : "none" }}
                    />
                    <div className="kprs__swatch-info">
                      <strong>{c.name}</strong>
                      <small>{c.role}</small>
                    </div>
                    <code className="kprs__swatch-hex">
                      {copiedColor === c.hex ? (
                        <span style={{ color: "#2E3A8A", display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Check size={12} /> Copied!
                        </span>
                      ) : (
                        c.hex
                      )}
                    </code>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="kprs__spec-card">
              <div className="kprs__spec-title-row">
                <FileText size={18} style={{ color: "#2E3A8A" }} />
                <h3>Typography Standards</h3>
              </div>
              <div className="kprs__type-sample">
                <span className="kprs__type-label">Editorial Headings</span>
                <div className="kprs__type-specimen-h">Playfair Display</div>
                <p className="kprs__type-sub">
                  Bold, warm, literary serif with high contrast. Used for hero titles, section headings, and product names.
                </p>
              </div>
              <div className="kprs__type-sample" style={{ marginTop: 24 }}>
                <span className="kprs__type-label">Body, UI &amp; Guidebooks</span>
                <div className="kprs__type-specimen-b">Lato &amp; Manrope</div>
                <p className="kprs__type-sub">
                  Modern humanist sans-serif optimized for crystal-clear readability across packaging and digital screens.
                </p>
              </div>
              <div className="kprs__type-sample" style={{ marginTop: 24 }}>
                <span className="kprs__type-label">Heritage Wordmark</span>
                <div className="kprs__type-specimen-s">अनुकूल (Sanskrit Devanagari)</div>
                <p className="kprs__type-sub">
                  Meaning "favorable, well-suited, harmonious". Celebrating authentic Rajasthani craft roots.
                </p>
              </div>
            </div>
          </div>

          {/* Boilerplate Section */}
          <div className="kprs__boiler-card">
            <div className="kprs__boiler-header">
              <div>
                <span className="eyebrow muted">COPY &amp; PASTE</span>
                <h2>The Anukool Boilerplate</h2>
                <p className="kprs__sub">Standard descriptive paragraph for articles, event listings, and media publications.</p>
              </div>
              <button
                type="button"
                className="button dark-button"
                onClick={handleCopyBoilerplate}
                style={{ background: "#2E3A8A", flexShrink: 0 }}
              >
                {copiedBoilerplate ? (
                  <>
                    <Check size={15} /> Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy size={15} /> Copy Boilerplate
                  </>
                )}
              </button>
            </div>
            <blockquote className="kprs__boiler-quote">
              <p>{boilerplateText}</p>
            </blockquote>
          </div>

          {/* Media Contact Card */}
          <div className="kprs__contact-banner">
            <div className="kprs__contact-text">
              <span className="eyebrow" style={{ color: "#D4AF37" }}>GET IN TOUCH</span>
              <h3>Need high-res assets or founder interviews?</h3>
              <p>
                Our media and artisan communications team is available for product samples, high-resolution lifestyle photography, workshop footage from Jaipur, and founder commentary.
              </p>
            </div>
            <div className="kprs__contact-cta">
              <a href="mailto:hello@anukool.in?subject=Media%20Enquiry%20-%20Anukool" className="button dark-button" style={{ background: "#C75B39" }}>
                <Mail size={16} /> Email hello@anukool.in <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <AnukoolPageFooter onNavigate={onNavigate} />
    </div>
  );
}
