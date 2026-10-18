import React, { useState } from "react";
import { Star, X, Camera, Check, Sparkles, Upload } from "lucide-react";

export default function ReviewModal({ product, onClose, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState("");
  const [city, setCity] = useState("Jaipur");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [craftExperience, setCraftExperience] = useState("First time maker");
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImagePreview(uploadEvent.target?.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!author || !body) return;

    const newReview = {
      id: `rev_${Date.now()}`,
      productId: product.id,
      rating,
      author,
      city,
      title: title || "Wonderful crafting experience!",
      body,
      craftExperience,
      photo: imagePreview,
      verified: true,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem("ank_reviews") || "[]");
      existing.unshift(newReview);
      localStorage.setItem("ank_reviews", JSON.stringify(existing));
    } catch (err) {
      console.warn("Failed to persist review:", err);
    }

    setSubmitted(true);
    if (onReviewSubmitted) onReviewSubmitted(newReview);
    setTimeout(() => {
      onClose();
    }, 1800);
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Write a Review">
      <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow" style={{ color: "#D4AF37", marginBottom: 4 }}>
              <Sparkles size={13} style={{ marginRight: 4 }} /> MAKER REVIEWS
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#2E3A8A", margin: 0 }}>
              Share Your Creation
            </h3>
            <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0" }}>
              For <strong>{product.name}</strong>
            </p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EEF0F8", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
              <Check size={28} style={{ color: "#2E3A8A" }} />
            </div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#2E3A8A", margin: "0 0 8px" }}>
              Dhanyavaad for sharing! 🪔
            </h4>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, margin: 0 }}>
              Your craft review and photo will inspire makers across India.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Star Rating Select */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#2E3A8A", letterSpacing: "1px", marginBottom: 6 }}>
                OVERALL RATING
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    style={{ background: "none", border: 0, padding: 2, cursor: "pointer" }}
                  >
                    <Star
                      size={26}
                      fill={(hoverRating || rating) >= star ? "#D4AF37" : "none"}
                      stroke={(hoverRating || rating) >= star ? "#D4AF37" : "#bbb"}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Author Name and City */}
            <div className="checkout-two">
              <label className="form-field">
                Your Name
                <input
                  required
                  placeholder="e.g. Ananya Sen"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </label>
              <label className="form-field">
                Your City
                <input
                  required
                  placeholder="e.g. Mumbai / Jaipur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
            </div>

            {/* Craft Experience */}
            <label className="form-field">
              Your Crafting Level
              <select value={craftExperience} onChange={(e) => setCraftExperience(e.target.value)}>
                <option>First time maker (Zero experience)</option>
                <option>Casual weekend crafter</option>
                <option>Experienced textile/art maker</option>
                <option>Made as a gift with family/partner</option>
              </select>
            </label>

            {/* Review Title & Body */}
            <label className="form-field">
              Review Headline
              <input
                placeholder="e.g. Beautiful fabric quality, so therapeutic to make!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="form-field">
              Your Experience
              <textarea
                required
                rows={3}
                placeholder="Tell other makers how your project turned out, the guide instructions, and who you gifted it to..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </label>

            {/* Photo Upload Attachment */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#2E3A8A", letterSpacing: "1px", marginBottom: 6 }}>
                ATTACH PHOTO OF YOUR FINISHED CRAFT (OPTIONAL)
              </label>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <label className="photo-upload-btn">
                  <Camera size={16} /> Choose Photo
                  <input type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: "none" }} />
                </label>
                {imagePreview && (
                  <div style={{ position: "relative", width: 50, height: 50, borderRadius: 8, overflow: "hidden", border: "1px solid #dcd3c4" }}>
                    <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.6)", color: "#fff", border: 0, borderRadius: "50%", width: 16, height: 16, fontSize: 10, cursor: "pointer", display: "grid", placeItems: "center" }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="button dark-button" style={{ background: "#2E3A8A", marginTop: 8 }}>
              POST REVIEW ✦
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
