import React from "react";
import { ArrowUpRight, Truck, ShieldCheck, Package } from "lucide-react";
import { AnukoolPageHeader, AnukoolPageFooter } from "../components/AnukoolLayout";

function ShippingPage({ onBack, onNavigate }) {
  return (
    <div className="anukool-page">
      <AnukoolPageHeader onBack={onBack} />
      <div className="anukool-page-hero">
        <div className="wrap">
          <div className="eyebrow">✦ PAN-INDIA POLICIES</div>
          <h1>Shipping, Delivery & Returns</h1>
          <p>Clear, customer-first delivery guidelines backed by our Jaipur fulfillment hub.</p>
        </div>
      </div>
      <div className="wrap policy-section">
        <h2>Delivery Timelines & Rates</h2>
        <p>Every Anukool order is carefully hand-inspected, packed in protective corrugated packaging, and dispatched directly from our workshop in Jaipur, Rajasthan.</p>
        <table className="shipping-table">
          <thead>
            <tr>
              <th>DESTINATION</th>
              <th>ESTIMATED TIME</th>
              <th>SHIPPING FEE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Orders ₹999 and above (Pan-India)</td>
              <td>3–5 business days</td>
              <td><strong style={{ color: '#2E3A8A' }}>FREE</strong></td>
            </tr>
            <tr>
              <td>Orders below ₹999 (Pan-India)</td>
              <td>3–5 business days</td>
              <td>₹99 flat</td>
            </tr>
            <tr>
              <td>Jaipur Local Delivery</td>
              <td>Next business day</td>
              <td>FREE</td>
            </tr>
          </tbody>
        </table>

        <h2>7-Day Easy Returns Policy</h2>
        <p>We want you to feel confident bringing Anukool into your home. If you change your mind, we gladly accept returns under these simple conditions:</p>
        <ul>
          <li>The return request is submitted within <strong>7 days</strong> of delivery.</li>
          <li>The kit remains unopened, with components in original packaging and seals intact.</li>
          <li>Digital pattern subscriptions are delivered digitally and cannot be refunded once downloaded.</li>
        </ul>

        <h2>Damaged or Incomplete Shipments</h2>
        <p>If any component is missing or damaged during transit, please email <strong>hello@anukool.in</strong> within 48 hours with a quick photo. We will immediately ship out replacement parts or a complete new kit at zero additional cost to you.</p>

        <h2>Refund Processing</h2>
        <p>Once your returned kit reaches our Jaipur facility and is verified, refunds are issued within <strong>3 to 5 business days</strong> directly to your original payment method (UPI / Bank Account / Card).</p>

        <div style={{ textAlign: 'center', marginTop: 40, paddingBottom: 60 }}>
          <button className="button dark-button" onClick={onBack}>
            BACK TO STORE <ArrowUpRight size={16}/>
          </button>
        </div>
      </div>
      <AnukoolPageFooter onNavigate={onNavigate} />
    </div>
  );
}


export default ShippingPage;
