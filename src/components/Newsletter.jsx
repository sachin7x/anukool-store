import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export function Newsletter({ onSubscribe }) {
  const [email, setEmail] = useState('');
  return (
    <form
      className="newsletter-form"
      onSubmit={e => {
        e.preventDefault();
        if (email.includes('@')) {
          onSubscribe();
          setEmail('');
        }
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email for maker updates"
      />
      <button type="submit" aria-label="Subscribe to newsletter">
        <ArrowUpRight size={19} />
      </button>
      <small>We share craft ideas, artisan stories, and festive kit announcements. No spam.</small>
    </form>
  );
}

export default Newsletter;
