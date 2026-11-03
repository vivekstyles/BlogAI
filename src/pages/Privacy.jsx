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
        description="BlogAI's privacy policy: what Google Analytics and Google Fonts receive when you browse, and what the blog submission form collects."
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
            What BlogAI collects when you read articles, browse the directory, or submit a blog.
          </p>
          <p className="privacy-updated">Last updated: 3 November 2026</p>
        </div>

        <div className="privacy-content">
          <section className="privacy-section">
            <h2>Analytics (Google Analytics)</h2>
            <p>
              We use Google Analytics 4 to understand which pages people read and how they find the
              site. It loads after the page has finished rendering and sets first-party cookies
              (<code>_ga</code> and <code>_ga_R1K6E4R7WG</code>) to tell visits apart. Google
              Analytics receives the pages you view, the referring page, your browser, device type,
              screen size and language, an approximate location derived from your IP address, and
              interactions such as scrolling and clicks on outbound links.
            </p>
            <p>
              This data is processed by Google under its own terms. Google explains how it uses
              information from sites that use its services in{' '}
              <a href="https://policies.google.com/technologies/partner-sites">
                How Google uses information from sites or apps that use our services
              </a>
              . You can block Google Analytics with your browser&rsquo;s tracking protection, a
              content blocker, or the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out browser add-on</a>.
              The site works the same with it blocked.
            </p>
            <p>
              We do not use advertising pixels or fingerprinting scripts.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Fonts</h2>
            <p>
              The site&rsquo;s fonts are loaded from Google Fonts, so your browser requests them from
              Google&rsquo;s servers, which receive your IP address and browser details as part of
              that request.
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
            <p>
              To help moderate submissions and block spam, the form also sends basic technical
              details from your browser along with it: the page you submitted from and the referring
              page (including any campaign tags in the link), your browser&rsquo;s user agent and
              platform, preferred languages, time zone, screen and window size, color-scheme
              preference, connection type, whether Do Not Track or Global Privacy Control is
              enabled, and how long the form took to fill in. Like any web request, the submission
              storage service also receives your IP address. These details are used only for
              reviewing submissions and are never published or shared with third parties.
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
