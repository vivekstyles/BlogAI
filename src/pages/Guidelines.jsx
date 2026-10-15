import React from 'react';
import { ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import './Guidelines.css';

export function Guidelines() {
  const breadcrumbs = [{ label: 'Submission Guidelines' }];

  return (
    <div className="guidelines-page">
      <SEOHead
        title="Submission Guidelines"
        description="Review the editorial and technical quality guidelines for listing blogs in the BlogAI directory."
        canonicalPath="/guidelines"
      />

      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <div className="guidelines-header">
          <div className="badge badge-brand">
            <ShieldCheck size={14} />
            <span>Editorial Standards</span>
          </div>
          <h1 className="guidelines-title">Submission &amp; Quality Guidelines</h1>
          <p className="guidelines-subtitle">
            To ensure high signal-to-noise ratio, all submissions are reviewed by maintainers
            against these clear quality benchmarks.
          </p>
        </div>

        <div className="guidelines-content">
          <section className="guide-block">
            <h2>Acceptance Criteria</h2>
            <div className="criteria-list">
              <div className="criterion-item pass">
                <CheckCircle size={20} className="crit-icon success" />
                <div>
                  <strong>Original &amp; Thoughtful Content:</strong>
                  <p>
                    Essays, architectures, tutorials, research logs, and technical retrospectives
                    authored by practitioners or researchers.
                  </p>
                </div>
              </div>

              <div className="criterion-item pass">
                <CheckCircle size={20} className="crit-icon success" />
                <div>
                  <strong>Working RSS/Atom Feeds:</strong>
                  <p>
                    Blogs must provide a functional syndication feed (RSS, Atom, or JSON Feed) to
                    enable decentralized reading.
                  </p>
                </div>
              </div>

              <div className="criterion-item pass">
                <CheckCircle size={20} className="crit-icon success" />
                <div>
                  <strong>Active Maintenance:</strong>
                  <p>
                    Publications should have at least one published article within the past 12–18
                    months, or possess significant evergreen archival value.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="guide-block">
            <h2>What We Do Not Accept</h2>
            <div className="criteria-list">
              <div className="criterion-item fail">
                <XCircle size={20} className="crit-icon danger" />
                <div>
                  <strong>Content Mills &amp; SEO Scrapers:</strong>
                  <p>
                    Websites created purely for programmatic affiliate revenue, keyword stuffing, or
                    republished articles without attribution.
                  </p>
                </div>
              </div>

              <div className="criterion-item fail">
                <XCircle size={20} className="crit-icon danger" />
                <div>
                  <strong>Unreviewed AI Slop:</strong>
                  <p>
                    Unedited automated regurgitation lacking human experience, experimentation, or
                    verifiable insights.
                  </p>
                </div>
              </div>

              <div className="criterion-item fail">
                <XCircle size={20} className="crit-icon danger" />
                <div>
                  <strong>Aggressive Paywalls &amp; Malicious Popups:</strong>
                  <p>
                    Sites that immediately block readers behind hard paywalls or employ abusive
                    interstitials and notification hijackers.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Guidelines;
