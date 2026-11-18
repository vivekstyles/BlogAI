import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, ScrollRestoration, useLocation } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import Home from '../pages/Home';

// Code-splitting for non-home pages to keep initial bundle small
const Category = lazy(() => import('../pages/Category'));
const BlogDetails = lazy(() => import('../pages/BlogDetails'));
const TagPage = lazy(() => import('../pages/TagPage'));
const SubmitBlog = lazy(() => import('../pages/SubmitBlog'));
const Articles = lazy(() => import('../pages/Articles'));
const ArticleDetails = lazy(() => import('../pages/ArticleDetails'));
const Directory = lazy(() => import('../pages/Directory'));
const About = lazy(() => import('../pages/About'));
const Guidelines = lazy(() => import('../pages/Guidelines'));
const Privacy = lazy(() => import('../pages/Privacy'));
const NotFound = lazy(() => import('../pages/NotFound'));

// The viewport-height minimum keeps the footer below the fold while a page chunk loads,
// so it does not visibly jump (layout shift) when the page replaces this placeholder.
function PageLoader() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', minHeight: '100vh' }}>
      <div className="skeleton-card" style={{ height: '300px', maxWidth: '800px', margin: '0 auto' }} />
    </div>
  );
}

/**
 * Fires a PostHog $pageview event on every client-side route change.
 * PostHog's React integration does not auto-capture SPA navigations,
 * so we do it manually here with the canonical URL.
 */
function PageViewTracker() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) return;
    posthog.capture('$pageview', {
      $current_url: window.location.href,
    });
  }, [location.pathname, location.search, posthog]);

  return null;
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:articleSlug" element={<ArticleDetails />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/category/:categorySlug" element={<Category />} />
        <Route path="/tag/:tagSlug" element={<TagPage />} />
        <Route path="/blog/:blogSlug" element={<BlogDetails />} />
        <Route path="/submit" element={<SubmitBlog />} />
        <Route path="/about" element={<About />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
