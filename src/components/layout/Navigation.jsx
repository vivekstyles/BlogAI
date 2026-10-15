import React from 'react';
import { NavLink } from 'react-router-dom';

export function Navigation({ onNavClick, categories = [] }) {
  return (
    <nav className="nav-links" aria-label="Main navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        onClick={onNavClick}
      >
        Discover
      </NavLink>

      <div className="nav-dropdown-wrapper">
        <span className="nav-link nav-dropdown-trigger" tabIndex={0}>
          Categories ▾
        </span>
        <div className="nav-dropdown-menu">
          {categories.map((cat) => (
            <NavLink
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
              onClick={onNavClick}
            >
              <span>{cat.name}</span>
              <span className="cat-count">({cat.count})</span>
            </NavLink>
          ))}
        </div>
      </div>

      <NavLink
        to="/submit"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        onClick={onNavClick}
      >
        Submit a Blog
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        onClick={onNavClick}
      >
        About
      </NavLink>
    </nav>
  );
}

export default Navigation;
