import React, { useState } from "react";
import { Mail, MapPin, Clock, ArrowUpRight, Check } from "lucide-react";
import { AnukoolPageHeader, AnukoolPageFooter } from "../components/AnukoolLayout";

function ContactPage({ onBack, onNavigate }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="anukool-page">
      <AnukoolPageHeader onBack={onBack} />
      <div className="anukool-page-hero">
        <div className="wrap">
          <div className="eyebrow">✦ WE ARE HERE TO HELP</div>
          <h1>Get in Touch with Anukool</h1>
          <p>Questions about kits, corporate gifting, or artisan partnerships? Drop us a line.</p>
        </div>
      </div>
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Let's talk craft.</h2>
            <p>Our team in Jaipur is available Monday to Saturday (10:00 AM – 6:30 PM IST) to answer any product queries or help coordinate custom gifting.</p>

            <div className="contact-detail">
              <Mail size={18} style={{ color: '#2E3A8A', marginTop: 2, flexShrink: 0 }}/>
              <div>
                <strong>Direct Email</strong>
                hello@anukool.in
              </div>
            </div>

            <div className="contact-detail">
              <MapPin size={18} style={{ color: '#2E3A8A', marginTop: 2, flexShrink: 0 }}/>
              <div>
                <strong>Artisan Hub & Parent Company</strong>
                V K Enterprises, Sanganer Industrial Area, Jaipur, Rajasthan 302029
              </div>
            </div>

            <div className="contact-detail">
              <Clock size={18} style={{ color: '#2E3A8A', marginTop: 2, flexShrink: 0 }}/>
              <div>
                <strong>Operating Hours</strong>
                Monday – Saturday: 10:00 AM – 6:30 PM IST
              </div>
            </div>

            <div style={{ marginTop: 28, background: '#f5eee3', padding: 22, borderRadius: 16, border: '1px solid #e7ded2' }}>
              <strong style={{ display: 'block', marginBottom: 6, color: '#2E3A8A' }}>Corporate & Festive Gifting</strong>
              <span style={{ fontSize: 13, lineHeight: 1.7, color: '#555' }}>
                Planning festival gifts for your team or clients? We curate customized kits with brand embossing and personalized note cards. Inquire above or email directly.
              </span>
            </div>
          </div>

          <div className="contact-form-card">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '36px 12px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dce8d3', color: '#2E3A8A', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
                  <Check size={32}/>
                </div>
                <h3>Message Received!</h3>
                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.8 }}>
                  Thank you for reaching out, <strong>{form.name}</strong>. A member of our Jaipur team will respond to <strong>{form.email}</strong> within 24 hours.
                </p>
                <button className="button dark-button" style={{ marginTop: 20 }} onClick={() => setSubmitted(false)}>
                  SEND ANOTHER NOTE
                </button>
              </div>
            ) : (
              <>
                <h3>Send a message</h3>
                <form className="checkout-form" onSubmit={handleSubmit}>
                  <label>Your Name
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rohini Sharma"/>
                  </label>
                  <div className="checkout-two">
                    <label>Email Address
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="rohini@example.com"/>
                    </label>
                    <label>Phone Number (optional)
                      <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210"/>
                    </label>
                  </div>
                  <label>Subject
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                      <option>General Enquiry</option>
                      <option>Order & Tracking Support</option>
                      <option>Corporate & Bulk Gifting</option>
                      <option>Artisan & Supplier Collaboration</option>
                      <option>Returns & Exchanges</option>
                    </select>
                  </label>
                  <label>Your Message
                    <textarea required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help you..." style={{ width: '100%', border: '1px solid #ded8cf', borderRadius: 7, padding: 11, fontSize: 13 }}/>
                  </label>
                  <button className="button dark-button checkout-button" type="submit">
                    SEND INQUIRY <ArrowUpRight size={16}/>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <AnukoolPageFooter onNavigate={onNavigate} />
    </div>
  );
}


export default ContactPage;
