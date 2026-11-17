import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { blogService } from '../../services/blogService';
import './NewsletterSubscribe.css';

/**
 * Reusable newsletter subscription widget.
 *
 * Props:
 *  - variant: 'inline' (default) | 'section'
 *    'inline'  → compact horizontal strip (for footer or sidebar)
 *    'section' → full-width centred section card (for home page)
 */
export function NewsletterSubscribe({ variant = 'inline' }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formStartedAt = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (formStartedAt.current === null) formStartedAt.current = Date.now();
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors._general) {
      setErrors((prev) => ({ ...prev, [name]: null, _general: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrors({});

    const result = await blogService.submitNewsletter(formData, {
      formStartedAt: formStartedAt.current,
    });

    if (result.success) {
      setSubmitted(true);
      formStartedAt.current = null;
    } else {
      setErrors(result.errors || {});
    }

    setIsSubmitting(false);
  };

  const isSection = variant === 'section';

  if (submitted) {
    return (
      <div className={`nl-success nl-success--${variant}`} role="status" aria-live="polite">
        <CheckCircle size={isSection ? 32 : 20} className="nl-success-icon" />
        <div>
          <p className="nl-success-title">You're subscribed!</p>
          {isSection && (
            <p className="nl-success-sub">
              Thank you — we'll send new articles and curated picks straight to your inbox. No spam,
              ever.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`nl-wrap nl-wrap--${variant}`}>
      {isSection && (
        <div className="nl-section-header">
          <div className="nl-icon-badge">
            <Mail size={20} />
          </div>
          <h2 className="nl-section-title">Stay in the Loop</h2>
          <p className="nl-section-desc">
            Get the best articles, curated blog picks, and directory updates delivered to your
            inbox. No spam — unsubscribe any time.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className={`nl-form nl-form--${variant}`}
        aria-label="Newsletter subscription"
      >
        {errors._general && (
          <div className="nl-error-banner" role="alert">
            <AlertCircle size={16} />
            <span>{errors._general}</span>
          </div>
        )}

        {isSection && (
          <div className="nl-field">
            <label htmlFor="nl-name" className="nl-label">
              Name <span className="nl-optional">(optional)</span>
            </label>
            <input
              type="text"
              id="nl-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="nl-input"
              autoComplete="name"
            />
          </div>
        )}

        <div className={`nl-field ${isSection ? '' : 'nl-field--inline'}`}>
          {isSection && (
            <label htmlFor="nl-email" className="nl-label">
              Email address <span className="nl-req">*</span>
            </label>
          )}
          <div className="nl-input-row">
            {!isSection && <Mail size={16} className="nl-input-icon" aria-hidden="true" />}
            <input
              type="email"
              id="nl-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={isSection ? 'you@example.com' : 'Subscribe for updates…'}
              className={`nl-input ${!isSection ? 'nl-input--with-icon' : ''} ${errors.email ? 'nl-input--invalid' : ''}`}
              aria-describedby={errors.email ? 'nl-email-err' : undefined}
              required
              autoComplete="email"
            />
            <button
              type="submit"
              className={`nl-btn ${isSection ? 'nl-btn--section' : 'nl-btn--inline'}`}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-label={isSubmitting ? 'Subscribing…' : 'Subscribe'}
            >
              {isSubmitting ? (
                <Loader size={16} className="nl-spinner" aria-hidden="true" />
              ) : isSection ? (
                <>
                  <Send size={16} aria-hidden="true" />
                  <span>Subscribe</span>
                </>
              ) : (
                <Send size={15} aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.email && (
            <span id="nl-email-err" className="nl-field-error" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <p className="nl-privacy-note">
          By subscribing you agree to receive occasional emails from BlogAI. See our{' '}
          <Link to="/privacy" className="nl-privacy-link">
            Privacy Policy
          </Link>
          . Basic browser details are collected with this form to help prevent spam.
        </p>
      </form>
    </div>
  );
}

export default NewsletterSubscribe;
