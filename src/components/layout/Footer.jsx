import React from 'react';
import { Link } from 'react-router-dom';
import { Rss, Compass, Heart, ExternalLink } from 'lucide-react';
import categoriesData from '../../data/categories';
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Col 1: Mission & Identity */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <div className="logo-icon-wrap">
                <Compass size={20} className="logo-icon" />
              </div>
              <span className="logo-title">BlogAI Directory</span>
            </div>
            <p className="footer-desc">
              Original articles plus a community-curated directory connecting engineers,
              mathematicians, physicists, and curious minds with exceptional independent blogs.
            </p>
            <div className="footer-opml-cta">
              <a href="/feed.opml" download="blogai-feeds.opml" className="btn btn-rss btn-sm">
                <Rss size={15} />
                <span>Export OPML Feeds</span>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              {categoriesData.map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`} className="footer-link">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Resources & Guidelines */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li>
                <Link to="/articles" className="footer-link">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/directory" className="footer-link">
                  Blog Directory
                </Link>
              </li>
              <li>
                <Link to="/submit" className="footer-link">
                  Submit a Blog
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="footer-link">
                  Submission Guidelines
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About the Directory
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Feeds & Syndication */}
          <div className="footer-col">
            <h4 className="footer-heading">Syndication</h4>
            <p className="footer-text-sm">
              All feeds are validated and synchronized directly from category source files.
            </p>
            <ul className="footer-links">
              <li>
                <a href="/feed.opml" className="footer-link" target="_blank" rel="noopener noreferrer">
                  feed.opml (OPML 2.0)
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" className="footer-link" target="_blank" rel="noopener noreferrer">
                  sitemap.xml (SEO Index)
                </a>
              </li>
              <li>
                <a href="/robots.txt" className="footer-link" target="_blank" rel="noopener noreferrer">
                  robots.txt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {currentYear} BlogAI Directory. Open-source, community-driven technical directory.
          </p>
          <p className="footer-credits">
            Built with React, Vite &amp; Python
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
