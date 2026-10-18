import React from "react";
import { Printer, X, Download, ShieldCheck } from "lucide-react";
import { calculateGstBreakdown, VK_ENTERPRISES_GSTIN, VK_ENTERPRISES_ADDRESS } from "../lib/dispatchEngine";
import { formatCurrency } from "../lib/currency";

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const total = order.total || order.subtotal || 0;
  const state = order.customer?.state || "Rajasthan";
  const gst = calculateGstBreakdown(total, state);
  const invoiceNumber = `INV-ANK-${order.id || Date.now()}`;
  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  function handlePrint() {
    window.print();
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Tax Invoice">
      <div className="invoice-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header Controls (Hidden during print) */}
        <div className="invoice-controls no-print">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="eyebrow" style={{ color: "#2E3A8A" }}>
              <ShieldCheck size={14} style={{ marginRight: 4 }} /> OFFICIAL TAX INVOICE
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="button dark-button" onClick={handlePrint} style={{ background: "#2E3A8A", padding: "8px 16px", fontSize: 12 }}>
              <Printer size={14} /> Print / Save PDF
            </button>
            <button className="icon-button" onClick={onClose} aria-label="Close invoice">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="invoice-sheet" id="printable-invoice">
          {/* Top Brand & Seller Bar */}
          <div className="invoice-header">
            <div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900, color: "#2E3A8A" }}>
                anu<span style={{ color: "#C75B39" }}>kool</span><i>.</i>
              </div>
              <p style={{ fontSize: 10, letterSpacing: "1.5px", color: "#68865D", fontWeight: 800, margin: "2px 0 0" }}>
                CRAFTED FOR CONNECTION
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#2E3A8A", margin: 0 }}>
                TAX INVOICE
              </h2>
              <p style={{ fontSize: 11, color: "#555", margin: "4px 0 0" }}>
                <strong>Invoice No:</strong> {invoiceNumber}
              </p>
              <p style={{ fontSize: 11, color: "#555", margin: "2px 0 0" }}>
                <strong>Date:</strong> {invoiceDate}
              </p>
            </div>
          </div>

          <div style={{ borderTop: "2px solid #2E3A8A", margin: "16px 0" }} />

          {/* Supplier & Recipient Addresses */}
          <div className="invoice-parties">
            <div className="invoice-party">
              <strong>SOLD BY / SUPPLIER:</strong>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#2E3A8A", margin: "4px 0 2px" }}>
                M/s V K Enterprises
              </p>
              <p style={{ fontSize: 11, color: "#555", margin: 0, lineHeight: 1.6 }}>
                {VK_ENTERPRISES_ADDRESS}
              </p>
              <p style={{ fontSize: 11, color: "#555", margin: "4px 0 0" }}>
                <strong>GSTIN:</strong> {VK_ENTERPRISES_GSTIN}
              </p>
              <p style={{ fontSize: 11, color: "#555", margin: 0 }}>
                <strong>State:</strong> Rajasthan (Code: 08)
              </p>
            </div>

            <div className="invoice-party" style={{ textAlign: "right" }}>
              <strong>BILL TO / SHIP TO:</strong>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a", margin: "4px 0 2px" }}>
                {order.customer?.name || "Craft Maker"}
              </p>
              <p style={{ fontSize: 11, color: "#555", margin: 0, lineHeight: 1.6 }}>
                {order.customer?.addressLine || "Residential Address"}
              </p>
              <p style={{ fontSize: 11, color: "#555", margin: 0 }}>
                {order.customer?.city || "Jaipur"}, {order.customer?.state || "Rajasthan"} - {order.customer?.postalCode || "302001"}
              </p>
              <p style={{ fontSize: 11, color: "#555", margin: "4px 0 0" }}>
                <strong>Phone:</strong> {order.customer?.phone || "+91 98765 43210"}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th style={{ width: "45%" }}>ITEM DESCRIPTION</th>
                <th>HSN</th>
                <th>QTY</th>
                <th>RATE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{item.name || "Jaipur Artisanal Craft Kit"}</strong>
                    {item.craftDetails && <small style={{ display: "block", color: "#666" }}>{item.craftDetails}</small>}
                  </td>
                  <td>5208</td>
                  <td>{item.qty || 1}</td>
                  <td>{formatCurrency(item.price || total)}</td>
                  <td>{formatCurrency((item.price || total) * (item.qty || 1))}</td>
                </tr>
              ))}
              {(!order.items || order.items.length === 0) && (
                <tr>
                  <td>
                    <strong>Anukool Handcrafted Craft Kit (Signature Edition)</strong>
                    <small style={{ display: "block", color: "#666" }}>100% Pure Jaipur Cotton with Artisanal Blocks & Dyes</small>
                  </td>
                  <td>5208</td>
                  <td>1</td>
                  <td>{formatCurrency(total)}</td>
                  <td>{formatCurrency(total)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals & Tax Computation */}
          <div className="invoice-totals">
            <div className="invoice-tax-details">
              <strong>Tax Summary (HSN 5208):</strong>
              <p style={{ fontSize: 11, color: "#555", margin: "4px 0" }}>
                Taxable Value: {formatCurrency(gst.taxableValue)}
              </p>
              {gst.isIntraState ? (
                <>
                  <p style={{ fontSize: 11, color: "#555", margin: "2px 0" }}>
                    CGST @ 2.5%: {formatCurrency(gst.cgst)}
                  </p>
                  <p style={{ fontSize: 11, color: "#555", margin: "2px 0" }}>
                    SGST @ 2.5%: {formatCurrency(gst.sgst)}
                  </p>
                </>
              ) : (
                <p style={{ fontSize: 11, color: "#555", margin: "2px 0" }}>
                  IGST @ 5%: {formatCurrency(gst.igst)}
                </p>
              )}
            </div>

            <div className="invoice-grand-total">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 4 }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(gst.taxableValue)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 4 }}>
                <span>GST (5%):</span>
                <span>{formatCurrency(gst.totalTax)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 24, borderTop: "2px solid #2E3A8A", paddingTop: 8, marginTop: 8 }}>
                <strong style={{ fontSize: 15, color: "#2E3A8A" }}>Grand Total:</strong>
                <strong style={{ fontSize: 15, color: "#2E3A8A" }}>{formatCurrency(total)}</strong>
              </div>
            </div>
          </div>

          {/* Footer Authorization Stamp */}
          <div className="invoice-footer">
            <div style={{ fontSize: 10, color: "#777", maxWidth: 360, lineHeight: 1.6 }}>
              Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Handcrafted in Jaipur.
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ borderBottom: "1px dashed #999", width: 160, display: "inline-block", height: 32 }} />
              <p style={{ fontSize: 10, fontWeight: 800, color: "#2E3A8A", margin: "4px 0 0" }}>
                For V K Enterprises
              </p>
              <p style={{ fontSize: 9, color: "#777", margin: 0 }}>Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
