import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import './NotFound.css';

export function NotFound() {
  return (
    <div className="notfound-page">
      <SEOHead
        title="404 - Page Not Found"
        description="The page you requested could not be found on BlogAI Directory."
        robots="noindex, nofollow"
      />

      <div className="container notfound-container">
        <span className="notfound-code">404</span>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-text">
          The page or publication you are looking for may have been moved, renamed, or does not
          exist.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Return to Home</span>
          </Link>
          <Link to="/#directory" className="btn btn-secondary">
            <Search size={16} />
            <span>Search Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
