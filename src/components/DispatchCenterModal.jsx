import React, { useState } from "react";
import {
  MessageSquare, Truck, X, Printer, Send, Copy, Check,
  RefreshCw, ExternalLink, ShieldCheck, MapPin, Package, Clock
} from "lucide-react";
import {
  CARRIERS,
  generateConsignmentRecord,
  buildWhatsAppDispatchUrl,
  generateBarcodeSvg,
  VK_ENTERPRISES_GSTIN,
  VK_ENTERPRISES_ADDRESS
} from "../lib/dispatchEngine";

export default function DispatchCenterModal({ order, onClose }) {
  const [activeTab, setActiveTab] = useState("whatsapp"); // 'whatsapp' | 'courier'
  const [carrierId, setCarrierId] = useState(order?.consignment?.carrierId || "delhivery");
  const [phone, setPhone] = useState(order?.customerPhone || order?.phone || "9876543210");
  const [copied, setCopied] = useState(false);

  // Editable AWB state
  const [consignment, setConsignment] = useState(() => {
    if (order?.consignment) return order.consignment;
    return generateConsignmentRecord(order?.orderNumber || "ANK-DEMO", order?.customer?.postalCode || "302001");
  });

  const selectedCarrier = CARRIERS.find(c => c.id === carrierId) || CARRIERS[0];
  const customerName = order?.customerName || order?.customer?.name || "Valued Maker";
  const kitName = order?.items?.[0]?.name || "Anukool Jaipur Handcrafted Kit";
  const orderId = order?.orderNumber || "ANK-102948";

  function handleCarrierChange(newCarrierId) {
    setCarrierId(newCarrierId);
    const chosen = CARRIERS.find(c => c.id === newCarrierId) || CARRIERS[0];
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    const newAwb = `${chosen.codePrefix}${randomDigits}`;
    setConsignment(prev => ({
      ...prev,
      carrier: chosen.name,
      carrierId: chosen.id,
      awb: newAwb,
      trackingUrl: `${chosen.trackingUrlBase}${newAwb}`
    }));
  }

  function handleRegenerateAwb() {
    const chosen = CARRIERS.find(c => c.id === carrierId) || CARRIERS[0];
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    const newAwb = `${chosen.codePrefix}${randomDigits}`;
    setConsignment(prev => ({
      ...prev,
      awb: newAwb,
      trackingUrl: `${chosen.trackingUrlBase}${newAwb}`
    }));
  }

  const waUrl = buildWhatsAppDispatchUrl({
    customerName,
    customerPhone: phone,
    orderId,
    awb: consignment.awb,
    carrier: consignment.carrier,
    kitName,
    estimatedDelivery: consignment.estimatedDelivery,
    trackingUrl: consignment.trackingUrl
  });

  const rawMessageText = decodeURIComponent(waUrl.split("?text=")[1] || "");

  function handleCopy() {
    navigator.clipboard?.writeText(rawMessageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrintLabel() {
    window.print();
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Dispatch and WhatsApp Center">
      <div className="dispatch-center-card" onClick={e => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="dispatch-modal-header no-print">
          <div>
            <span className="eyebrow" style={{ color: "#2E3A8A", display: "flex", alignItems: "center", gap: 6 }}>
              <Truck size={14} /> FULFILLMENT & DISPATCH SUITE
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#2E3A8A", margin: "4px 0 0" }}>
              Order Dispatch & Communication Hub
            </h2>
            <p style={{ fontSize: 12, color: "#666", margin: "2px 0 0" }}>
              Order <strong>#{orderId}</strong> • Destination: <strong>{consignment.destinationPin}</strong>
            </p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="dispatch-tab-bar no-print">
          <button
            className={`dispatch-tab-btn ${activeTab === "whatsapp" ? "active" : ""}`}
            onClick={() => setActiveTab("whatsapp")}
          >
            <MessageSquare size={16} /> WhatsApp Order Alert Mockup
          </button>
          <button
            className={`dispatch-tab-btn ${activeTab === "courier" ? "active" : ""}`}
            onClick={() => setActiveTab("courier")}
          >
            <Truck size={16} /> Courier AWB Generator & Shipping Label
          </button>
        </div>

        {/* ========================================================
            TAB 1: WHATSAPP ORDER ALERT MOCKUP
            ======================================================== */}
        {activeTab === "whatsapp" && (
          <div className="dispatch-tab-content">
            <div className="wa-mockup-layout">
              {/* Left: Realistic Smartphone Frame Mockup */}
              <div className="wa-phone-frame">
                <div className="wa-phone-notch" />
                {/* WhatsApp Chat Header */}
                <div className="wa-chat-header">
                  <div className="wa-chat-avatar">🪔</div>
                  <div className="wa-chat-meta">
                    <div className="wa-chat-name">
                      Anukool Jaipur <span className="wa-badge">✓</span>
                    </div>
                    <div className="wa-chat-status">Official Business • Online</div>
                  </div>
                </div>

                {/* Chat Stream with Background Doodle Pattern */}
                <div className="wa-chat-stream">
                  <div className="wa-timestamp-pill">TODAY</div>

                  {/* Customer Notification Bubble */}
                  <div className="wa-message-bubble">
                    <div className="wa-bubble-greeting">Namaste {customerName}! 🪔</div>
                    <p>
                      Your handmade Anukool craft kit has been packed with love at <strong>V K Enterprises, Jaipur</strong>!
                    </p>

                    <div className="wa-bubble-card">
                      <div>📦 <strong>Order ID:</strong> #{orderId}</div>
                      <div>🎨 <strong>Kit:</strong> {kitName}</div>
                      <div>🚚 <strong>Courier:</strong> {consignment.carrier}</div>
                      <div>🏷️ <strong>AWB Tracking:</strong> {consignment.awb}</div>
                      <div>⏱️ <strong>Estimated Delivery:</strong> {consignment.estimatedDelivery}</div>
                    </div>

                    <p style={{ marginTop: 8 }}>
                      🚚 <strong>Track Your Package:</strong><br />
                      <span style={{ color: "#039be5", textDecoration: "underline" }}>
                        {consignment.trackingUrl}
                      </span>
                    </p>

                    <p style={{ fontSize: 11, color: "#555", marginTop: 6 }}>
                      ✨ <em>Need help or crafting advice? Reply right here or email hello@anukool.in. Happy crafting!</em><br />
                      <strong>— Anukool Team, Jaipur</strong>
                    </p>

                    <div className="wa-bubble-footer">
                      <span>{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="wa-blue-ticks">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Sender Controls & Real Testing */}
              <div className="wa-controls-panel">
                <h3>Send Live WhatsApp Notification</h3>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                  Test real WhatsApp messaging directly from your device. You can send this alert to your own phone number or your customer's WhatsApp.
                </p>

                <label className="form-field">
                  Recipient Mobile Number (with country code)
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 919876543210 or 9876543210"
                    style={{ fontSize: 14, fontWeight: 700 }}
                  />
                </label>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button"
                    style={{
                      background: "#25D366",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "14px",
                      borderRadius: 8,
                      fontWeight: 800,
                      textDecoration: "none",
                      fontSize: 13
                    }}
                  >
                    <Send size={16} /> OPEN IN WHATSAPP & SEND ALERT
                  </a>

                  <button
                    className="button"
                    onClick={handleCopy}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #2E3A8A",
                      color: "#2E3A8A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "12px",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 12
                    }}
                  >
                    {copied ? <Check size={16} style={{ color: "#10b981" }} /> : <Copy size={16} />}
                    {copied ? "COPIED TO CLIPBOARD!" : "COPY MESSAGE TEXT"}
                  </button>
                </div>

                <div className="wa-tips-box">
                  <strong>✦ Production Feature:</strong>
                  <p style={{ fontSize: 11, color: "#666", margin: "4px 0 0", lineHeight: 1.6 }}>
                    This wa.me payload links directly to WhatsApp Web on desktops or the native WhatsApp app on iOS/Android. In production, this can also trigger automated WhatsApp Business Cloud API messages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: COURIER AWB GENERATOR & THERMAL SHIPPING LABEL
            ======================================================== */}
        {activeTab === "courier" && (
          <div className="dispatch-tab-content">
            {/* Top Carrier Selector Toolbar */}
            <div className="courier-toolbar no-print">
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: "#2E3A8A", display: "block", marginBottom: 6 }}>
                  SELECT LOGISTICS PARTNER
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {CARRIERS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className={`carrier-chip ${carrierId === c.id ? "active" : ""}`}
                      onClick={() => handleCarrierChange(c.id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <button
                  type="button"
                  className="button"
                  onClick={handleRegenerateAwb}
                  style={{
                    background: "#EEF0F8",
                    border: "1px solid #2E3A8A",
                    color: "#2E3A8A",
                    padding: "8px 14px",
                    fontSize: 11,
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <RefreshCw size={13} /> REGENERATE AWB
                </button>
                <button
                  type="button"
                  className="button dark-button"
                  onClick={handlePrintLabel}
                  style={{ background: "#2E3A8A", padding: "8px 16px", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Printer size={13} /> PRINT 4×6" THERMAL LABEL
                </button>
              </div>
            </div>

            {/* Printable 4x6 Thermal Courier Label */}
            <div className="thermal-label-container" id="printable-thermal-label">
              {/* Header Grid */}
              <div className="label-header">
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, color: "#111" }}>
                    anu<span style={{ color: "#C75B39" }}>kool</span><i>.</i>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: "#555" }}>JAIPUR ARTISANAL CRAFT</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="label-carrier-badge">{consignment.carrier}</div>
                  <div style={{ fontSize: 10, fontWeight: 800, marginTop: 4 }}>STANDARD AIR EXPRESS</div>
                </div>
              </div>

              {/* Barcode Block */}
              <div className="label-barcode-block">
                <div dangerouslySetInnerHTML={{ __html: generateBarcodeSvg(consignment.awb) }} />
              </div>

              {/* Routing & Payment Code */}
              <div className="label-routing-row">
                <div className="routing-box">
                  <span className="box-title">ROUTING HUB</span>
                  <strong>JAI / {consignment.destinationPin?.slice(0, 2) === "11" ? "DEL-01" : consignment.destinationPin?.slice(0, 2) === "40" ? "BOM-06" : "BLR-04"}</strong>
                </div>
                <div className="routing-box">
                  <span className="box-title">ORDER REF</span>
                  <strong>#{orderId}</strong>
                </div>
                <div className="routing-box highlight">
                  <span className="box-title">PAYMENT</span>
                  <strong>PREPAID (UPI)</strong>
                </div>
              </div>

              {/* Shipper & Consignee Columns */}
              <div className="label-address-grid">
                <div className="label-address-box">
                  <span className="box-title">SHIP FROM (ORIGIN):</span>
                  <strong>M/s V K Enterprises</strong>
                  <p>{VK_ENTERPRISES_ADDRESS}</p>
                  <p>GSTIN: {VK_ENTERPRISES_GSTIN} • Ph: +91 98290 12345</p>
                </div>

                <div className="label-address-box">
                  <span className="box-title">SHIP TO (CONSIGNEE):</span>
                  <strong style={{ fontSize: 14 }}>{customerName}</strong>
                  <p>{order?.customer?.addressLine1 || "Plot No 42, Artisan Lane"}</p>
                  {order?.customer?.addressLine2 && <p>{order?.customer?.addressLine2}</p>}
                  <p>{order?.customer?.city || "Jaipur"}, {order?.customer?.state || "Rajasthan"} - <strong>{consignment.destinationPin}</strong></p>
                  <p style={{ marginTop: 4 }}><strong>Contact:</strong> {phone}</p>
                </div>
              </div>

              {/* Package Manifest Specifications */}
              <div className="label-manifest-row">
                <div>
                  <span className="box-title">CONTENTS</span>
                  <span>{kitName}</span>
                </div>
                <div>
                  <span className="box-title">WEIGHT</span>
                  <span>0.850 KG</span>
                </div>
                <div>
                  <span className="box-title">DIMENSIONS</span>
                  <span>22 × 16 × 8 CM</span>
                </div>
                <div>
                  <span className="box-title">HSN CODE</span>
                  <span>5208 (Cotton Handcraft)</span>
                </div>
              </div>

              {/* Footer Return Instructions */}
              <div className="label-footer">
                If undelivered, please return to V K Enterprises, Jaipur Fulfillment Hub. Tracking: {consignment.trackingUrl}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
