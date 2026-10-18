import React from 'react';
import { Heart, Plus } from 'lucide-react';
import { money } from '../lib/utils';

export function ProductCard({ product: p, onAdd, onOpen, saved, onSave, currency = 'INR' }) {
  return (
    <article className="product-card">
      <div className="product-art" style={{ background: p.color }}>
        <span className="product-tag">{p.tag}</span>
        <button
          className={saved ? 'save-product saved' : 'save-product'}
          aria-label={saved ? 'Remove from saved' : 'Save kit'}
          onClick={e => {
            e.stopPropagation();
            onSave();
          }}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button className="product-art-open" aria-label={`View ${p.name}`} onClick={onOpen}>
          {p.image ? (
            <img src={p.image} alt={p.name} className="product-card-img" loading="lazy" />
          ) : (
            <span className="product-emoji">{p.emoji}</span>
          )}
          <span className="art-spark">✳</span>
        </button>
        <button className="quick-add" onClick={onAdd}>
          <Plus size={15} /> QUICK ADD <span>· {money(p.price, currency)}</span>
        </button>
      </div>
      <div className="product-details">
        <div className="rating">
          <span>★★★★★</span> {Number(p.rating || 4.8).toFixed(1)} <i>· MAKER RATED</i>
        </div>
        <button className="product-title-button" onClick={onOpen}>
          {p.name}
        </button>
        <div className="product-bottom">
          <strong>{money(p.price, currency)}</strong>
          <span>{p.category}</span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
