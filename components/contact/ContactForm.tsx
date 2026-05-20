'use client';

import { useState } from 'react';
import styles from '@/app/contact/Contact.module.css';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone: phone || undefined, message }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? 'Could not send your message. Please try again.');
      return;
    }

    setSent(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  }

  if (sent) {
    return (
      <div className={styles.formContainer}>
        <p className={styles.successMessage} role="status">
          Thank you — your inquiry has been received. Our team will respond shortly.
        </p>
        <button type="button" className={styles.submitBtn} onClick={() => setSent(false)}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <section className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        {error && (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.input}
            required
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={styles.input}
            placeholder="+91 00000 00000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className={styles.textarea}
            required
            placeholder="How can we help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </section>
  );
}
