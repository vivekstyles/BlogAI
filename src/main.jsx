import React from 'react';
import { createRoot } from 'react-dom/client';
import Providers from './app/providers';
import App from './app/App';
import './styles/variables.css';
import './styles/global.css';
import './styles/responsive.css';

// scripts/prerender.js fills #root with simplified static HTML for crawlers.
// It never matches the React tree, so render fresh (replacing it) instead of hydrating.
const container = document.getElementById('root');

// Each page renders its own JSON-LD through SEOHead. Drop the prerendered copies so the
// markup is not duplicated, and does not go stale after client-side navigation.
document.querySelectorAll('head script[type="application/ld+json"]').forEach((el) => el.remove());

createRoot(container).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
