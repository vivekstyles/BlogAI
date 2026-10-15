import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Rss, Layers, Users } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import './About.css';

export function About() {
  const breadcrumbs = [{ label: 'About' }];

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About BlogAI Directory',
    description: 'Learn about the mission, architecture, and curation philosophy behind BlogAI Directory.',
    url: 'https://blogai.directory/about',
  };

  return (
    <div className="about-page">
      <SEOHead
        title="About the Directory"
        description="Learn about the mission, open architecture, and curation standards behind the BlogAI community blog directory."
        canonicalPath="/about"
        jsonLd={aboutSchema}
      />

      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <div className="about-header">
          <div className="badge badge-brand">
            <Compass size={14} />
            <span>Open Directory Project</span>
          </div>
          <h1 className="about-title">About BlogAI Directory</h1>
          <p className="about-subtitle">
            An open-access platform built to champion long-form, independent technical writing
            and combat algorithmic feed exhaustion.
          </p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>The Mission</h2>
            <p>
              In an era dominated by algorithmic social timelines and content farms, discovering
              high-signal, deeply researched independent blogs has become challenging. Many of the
              world’s best engineering and scientific insights live on personal websites, lab logs,
              and domain-specific journals.
            </p>
            <p>
              BlogAI organizes these gems into an open-source, community-verified index. Every entry
              is curated for substance, clarity, and ongoing relevance.
            </p>
          </section>

          <section className="about-section">
            <h2>Core Architectural Principles</h2>
            <div className="principles-grid">
              <div className="principle-card">
                <ShieldCheck size={24} className="principle-icon" />
                <h3>Zero Tracking &amp; No Ads</h3>
                <p>
                  No invasive trackers, advertising networks, or sponsored pay-to-play placements.
                  The directory serves readers and authors only.
                </p>
              </div>

              <div className="principle-card">
                <Rss size={24} className="principle-icon" />
                <h3>RSS &amp; Open Web First</h3>
                <p>
                  Every blog in the directory features validated RSS or Atom syndication feeds.
                  Users can export the complete catalog via OPML with one click.
                </p>
              </div>

              <div className="principle-card">
                <Layers size={24} className="principle-icon" />
                <h3>Static Pre-Rendering &amp; SEO</h3>
                <p>
                  Built with React and pre-rendered for search engines. Every category, tag,
                  and publication has unique metadata and crawlable HTML.
                </p>
              </div>

              <div className="principle-card">
                <Users size={24} className="principle-icon" />
                <h3>Community Governed</h3>
                <p>
                  Source data is maintained in human-readable CSV files in Git. Anyone can suggest
                  corrections or submit new publications via pull requests.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>How to Subscribe with OPML</h2>
            <p>
              Rather than checking multiple sites manually, we encourage using an RSS reader (such
              as NetNewsWire, Feedly, NewsBlur, or Inoreader).
            </p>
            <p>
              You can download the synchronized directory feed file directly:{' '}
              <a href="/feed.opml" download="blogai-feeds.opml" className="inline-link">
                Download feed.opml
              </a>{' '}
              and import it into any modern feed reader.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
