import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  GitPullRequest,
  Sparkles,
} from 'lucide-react';
import { blogService } from '../services/blogService';
import categoriesData from '../data/categories';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import './SubmitBlog.css';

export function SubmitBlog() {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    feed: '',
    category: '',
    tags: '',
    description: '',
    author: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrors({});

    const result = await blogService.submitCommunityBlog(formData);

    if (result.success) {
      setSubmissionSuccess(result.submission);
      setFormData({
        title: '',
        address: '',
        feed: '',
        category: '',
        tags: '',
        description: '',
        author: '',
        email: '',
      });
    } else {
      setErrors(result.errors || {});
    }

    setIsSubmitting(false);
  };

  const breadcrumbs = [{ label: 'Submit a Blog' }];

  return (
    <div className="submit-page">
      <SEOHead
        title="Submit a Publication"
        description="Recommend a high-quality independent blog in engineering, mathematics, physics, science, or automotive tech for inclusion in BlogAI Directory."
        canonicalPath="/submit"
        robots="index, follow"
      />

      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <div className="submit-header">
          <div className="submit-badge">
            <Sparkles size={14} />
            <span>Community Driven</span>
          </div>
          <h1 className="submit-title">Submit a Blog for Review</h1>
          <p className="submit-subtitle">
            Do you write or follow a high-signal independent publication? Share it with the
            community. Every entry is reviewed against our editorial quality standards.
          </p>
        </div>

        <div className="submit-layout">
          {/* Main Form */}
          <div className="submit-form-card">
            {submissionSuccess ? (
              <div className="submission-success-banner" role="status" aria-live="polite">
                <CheckCircle size={36} className="success-icon" />
                <h2>Submission Received!</h2>
                <p>
                  Thank you for suggesting <strong>{submissionSuccess.title}</strong>! Your
                  submission has been queued for editorial review.
                </p>
                <div className="success-meta-box">
                  <p>
                    <strong>Address:</strong> {submissionSuccess.address}
                  </p>
                  <p>
                    <strong>Category:</strong> {submissionSuccess.category}
                  </p>
                  <p>
                    <strong>Status:</strong> Awaiting Editorial Moderation
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSubmissionSuccess(null)}
                >
                  Submit Another Publication
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="blog-submit-form">
                {/* General form error if any */}
                {errors._general && (
                  <div className="form-alert-danger" role="alert">
                    <AlertCircle size={18} />
                    <span>{errors._general}</span>
                  </div>
                )}

                {/* Title */}
                <div className="form-group">
                  <label htmlFor="field-title" className="form-label">
                    Blog Title <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="field-title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Overreacted, Martin Fowler, Quanta Magazine"
                    className={`form-input ${errors.title ? 'is-invalid' : ''}`}
                    aria-describedby={errors.title ? 'err-title' : undefined}
                    required
                  />
                  {errors.title && (
                    <span id="err-title" className="field-error" role="alert">
                      {errors.title}
                    </span>
                  )}
                </div>

                {/* Website Address */}
                <div className="form-group">
                  <label htmlFor="field-address" className="form-label">
                    Website Address (URL) <span className="req">*</span>
                  </label>
                  <input
                    type="url"
                    id="field-address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className={`form-input ${errors.address ? 'is-invalid' : ''}`}
                    aria-describedby={errors.address ? 'err-address' : undefined}
                    required
                  />
                  {errors.address && (
                    <span id="err-address" className="field-error" role="alert">
                      {errors.address}
                    </span>
                  )}
                </div>

                {/* RSS Feed */}
                <div className="form-group">
                  <label htmlFor="field-feed" className="form-label">
                    RSS / Atom Feed URL
                  </label>
                  <input
                    type="url"
                    id="field-feed"
                    name="feed"
                    value={formData.feed}
                    onChange={handleChange}
                    placeholder="https://example.com/feed.xml or /rss"
                    className={`form-input ${errors.feed ? 'is-invalid' : ''}`}
                    aria-describedby={errors.feed ? 'err-feed' : undefined}
                  />
                  {errors.feed && (
                    <span id="err-feed" className="field-error" role="alert">
                      {errors.feed}
                    </span>
                  )}
                  <span className="field-hint">
                    Enables users to syndicate this blog via our OPML collection.
                  </span>
                </div>

                {/* Category & Author Grid */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="field-category" className="form-label">
                      Category <span className="req">*</span>
                    </label>
                    <select
                      id="field-category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                      aria-describedby={errors.category ? 'err-category' : undefined}
                      required
                    >
                      <option value="">Select category...</option>
                      {categoriesData.map((c) => (
                        <option key={c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <span id="err-category" className="field-error" role="alert">
                        {errors.category}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="field-author" className="form-label">
                      Author / Organization
                    </label>
                    <input
                      type="text"
                      id="field-author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="e.g. Jane Doe or Engineering Team"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="form-group">
                  <label htmlFor="field-tags" className="form-label">
                    Tags / Topics <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="field-tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g. distributed systems; linux; architecture"
                    className={`form-input ${errors.tags ? 'is-invalid' : ''}`}
                    aria-describedby={errors.tags ? 'err-tags' : undefined}
                    required
                  />
                  {errors.tags && (
                    <span id="err-tags" className="field-error" role="alert">
                      {errors.tags}
                    </span>
                  )}
                  <span className="field-hint">Separate multiple tags with semicolons or commas.</span>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="field-description" className="form-label">
                    Brief Description
                  </label>
                  <textarea
                    id="field-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="1-2 sentences summarizing what topics this blog covers and why it is high value."
                    className="form-textarea"
                  />
                </div>

                {/* Submitter Email */}
                <div className="form-group">
                  <label htmlFor="field-email" className="form-label">
                    Submitter Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="field-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your-email@example.com"
                    className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                    aria-describedby={errors.email ? 'err-email' : undefined}
                  />
                  {errors.email && (
                    <span id="err-email" className="field-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                  <span className="field-hint">
                    Only used if moderators have questions. Never published or shared.
                  </span>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary submit-submit-btn"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Publication'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Submission Guidelines Sidebar */}
          <aside className="submit-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-header">
                <Info size={18} className="sidebar-icon" />
                <h3>Quality Standards</h3>
              </div>
              <ul className="guidelines-list">
                <li>Original, insightful analysis or educational technical depth.</li>
                <li>Actively maintained with posts within the last 12-18 months.</li>
                <li>Valid HTTP/HTTPS domain and working RSS/Atom feed where possible.</li>
                <li>No low-quality SEO scrapers or AI-generated spam farms.</li>
              </ul>
              <Link to="/guidelines" className="sidebar-link">
                Read Full Guidelines &rarr;
              </Link>
            </div>

            <div className="sidebar-card pr-card">
              <div className="sidebar-header">
                <GitPullRequest size={18} className="sidebar-icon" />
                <h3>Prefer Git Pull Requests?</h3>
              </div>
              <p>
                Since BlogAI is 100% open-source, you can also add a row directly to the
                appropriate <code>Categories/&lt;Domain&gt;/blogs.csv</code> file and submit a GitHub
                PR!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default SubmitBlog;
