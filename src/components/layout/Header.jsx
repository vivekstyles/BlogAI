import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X, PlusCircle, Compass, Bell } from 'lucide-react';
import Navigation from './Navigation';
import NewsletterSubscribe from '../newsletter/NewsletterSubscribe';
import categoriesData from '../../data/categories';
import { articleService } from '../../services/articleService';
import './Header.css';

// The Categories menu counts everything in a category: directory blogs plus original articles
const navCategories = categoriesData.map((cat) => ({
  ...cat,
  count: cat.count + articleService.getArticlesByCategory(cat.slug).length,
}));

export function Header() {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const subscribeRef = useRef(null);

  useEffect(() => {
    // Dark is the default theme; light is applied only when explicitly saved
    const savedTheme = localStorage.getItem('blogai_theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setIsDark(true);
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  // Close subscribe popover on outside click / Escape
  useEffect(() => {
    if (!subscribeOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') setSubscribeOpen(false); };
    const handleClick = (e) => {
      if (subscribeRef.current && !subscribeRef.current.contains(e.target)) {
        setSubscribeOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [subscribeOpen]);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('blogai_theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('blogai_theme', 'light');
    }
  };

  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="container header-container">
        {/* Brand Logo */}
        <Link to="/" className="site-logo" aria-label="BlogAI Home">
          <div className="logo-icon-wrap">
            <Compass size={22} className="logo-icon" />
          </div>
          <div className="logo-text">
            <span className="logo-title">BlogAI</span>
            <span className="logo-tag">Directory</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="header-nav-desktop desktop-only">
          <Navigation categories={navCategories} />
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Subscribe popover — desktop only */}
          <div className="subscribe-popover-wrap desktop-only" ref={subscribeRef}>
            <button
              type="button"
              className={`btn btn-sm subscribe-trigger-btn ${subscribeOpen ? 'subscribe-trigger-btn--active' : ''}`}
              onClick={() => setSubscribeOpen((o) => !o)}
              aria-expanded={subscribeOpen}
              aria-haspopup="dialog"
              aria-label="Subscribe to newsletter"
            >
              <Bell size={15} aria-hidden="true" />
              <span>Subscribe</span>
            </button>

            {subscribeOpen && (
              <div
                className="subscribe-popover"
                role="dialog"
                aria-modal="false"
                aria-label="Newsletter subscription"
              >
                <div className="subscribe-popover-header">
                  <span className="subscribe-popover-title">Newsletter</span>
                  <button
                    type="button"
                    className="subscribe-popover-close"
                    onClick={() => setSubscribeOpen(false)}
                    aria-label="Close newsletter panel"
                  >
                    <X size={16} />
                  </button>
                </div>
                <NewsletterSubscribe variant="inline" />
              </div>
            )}
          </div>

          <Link to="/submit" className="btn btn-primary btn-sm desktop-only submit-btn">
            <PlusCircle size={16} />
            <span>Submit Blog</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="mobile-menu-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div className="container mobile-drawer-content">
            <Navigation
              categories={navCategories}
              onNavClick={() => setMobileMenuOpen(false)}
            />
            <div className="mobile-drawer-cta">
              <Link
                to="/submit"
                className="btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle size={18} />
                <span>Submit a Blog</span>
              </Link>
              <div className="mobile-drawer-newsletter">
                <p className="mobile-drawer-newsletter-label">Newsletter</p>
                <NewsletterSubscribe variant="inline" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
