/**
 * PostHog analytics utilities for BlogAI.
 *
 * Usage:
 *   import { useAnalytics } from '../analytics/posthog';
 *   const { capture } = useAnalytics();
 *   capture('event_name', { prop: 'value' });
 *
 * Or for non-React contexts:
 *   import posthog from 'posthog-js';
 *   posthog.capture('event_name', { prop: 'value' });
 */
import { usePostHog } from '@posthog/react';

/**
 * Hook that returns a stable `capture` function bound to the
 * current PostHog instance.  Returns a no-op when PostHog is
 * not yet initialised (e.g. during SSR pre-render).
 */
export function useAnalytics() {
  const posthog = usePostHog();

  function capture(event, properties = {}) {
    if (!posthog) return;
    posthog.capture(event, properties);
  }

  return { posthog, capture };
}

// ─── Shared event name constants ────────────────────────────────────────────
// Centralising names avoids typo-driven mis-fires across the codebase.

export const EVENTS = {
  // Navigation
  PAGE_VIEW: '$pageview', // fired automatically by PostHog

  // Blog directory
  BLOG_VISIT_CLICKED: 'blog_visit_clicked',    // "Visit Official Website"
  BLOG_FEED_CLICKED: 'blog_feed_clicked',       // RSS / Atom feed link
  BLOG_CARD_CLICKED: 'blog_card_clicked',       // BlogCard thumbnail / title

  // Articles
  ARTICLE_VIEWED: 'article_viewed',             // article detail page loaded
  ARTICLE_CONTENT_LOAD_FAILED: 'article_content_load_failed',

  // Search
  SEARCH_PERFORMED: 'search_performed',         // user finished typing (debounced)
  SEARCH_CLEARED: 'search_cleared',

  // Blog submission form
  SUBMIT_FORM_STARTED: 'submit_form_started',   // first keystroke
  SUBMIT_FORM_ATTEMPTED: 'submit_form_attempted',
  SUBMIT_FORM_SUCCEEDED: 'submit_form_succeeded',
  SUBMIT_FORM_FAILED: 'submit_form_failed',
};
