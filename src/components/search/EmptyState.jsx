import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, RotateCcw, PlusCircle } from 'lucide-react';
import './EmptyState.css';

export function EmptyState({
  title = 'No blogs found',
  message = 'We could not find any blogs matching your search and filter criteria.',
  onReset,
  showSubmitCta = true,
}) {
  return (
    <div className="empty-state-card" role="status" aria-live="polite">
      <div className="empty-state-icon-wrap">
        <SearchX size={36} className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>

      <div className="empty-state-actions">
        {onReset && (
          <button type="button" onClick={onReset} className="btn btn-secondary btn-sm">
            <RotateCcw size={15} />
            <span>Reset Filters</span>
          </button>
        )}
        {showSubmitCta && (
          <Link to="/submit" className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>Suggest a Missing Blog</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
