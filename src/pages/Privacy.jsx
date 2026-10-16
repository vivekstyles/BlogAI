import React from 'react';
import { Lock } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import './Privacy.css';

export function Privacy() {
  const breadcrumbs = [{ label: 'Privacy Policy' }];

  return (
    <div className="privacy-page">
      <SEOHead
        title="Privacy Policy"
        description="Privacy policy for BlogAI Directory: zero tracking, no cookies, and no personal data collection."
        canonicalPath="/privacy"
      />

      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <div className="privacy-header">
          <div className="badge badge-brand">
            <Lock size={14} />
            <span>User Respect</span>
          </div>
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-subtitle">
            BlogAI Directory is committed to privacy, transparency, and minimal data footprint.
          </p>
        </div>

        <div className="privacy-content">
          <section className="privacy-section">
            <h2>No Tracking or Analytics Cookies</h2>
            <p>
              We do not use tracking cookies, Google Analytics, advertising pixels, or fingerprinting
              scripts. The directory can be browsed completely anonymously.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Local Client Storage</h2>
            <p>
              Your browser&rsquo;s <code>localStorage</code> is used strictly for saving your UI theme
              preference (light or dark mode). It holds no personal data.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Community Blog Submissions</h2>
            <p>
              When you suggest a publication via the community form, the details you enter (including
              the optional submitter email) are sent to our submission storage service for editorial
              review. Contact information is only used by maintainers for clarifying questions
              regarding the submission and is never published or shared with third parties.
            </p>
          </section>

          <section className="privacy-section">
            <h2>External Links</h2>
            <p>
              This directory links to independent external publications across the web. When clicking
              out to a blog, their independent privacy policies and terms apply.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
