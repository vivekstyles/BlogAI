import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import TagChip from '../tags/TagChip';
import './CategoryCard.css';

export function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <div className="category-card">
      <div className="category-card-header">
        <div className="category-icon-box">
          <BookOpen size={20} />
        </div>
        <span className="category-card-count">
          {category.count} {category.count === 1 ? 'Blog' : 'Blogs'}
        </span>
      </div>

      <h3 className="category-card-title">
        <Link to={`/category/${category.slug}`} className="category-card-link">
          {category.name}
        </Link>
      </h3>

      <p className="category-card-desc">{category.description}</p>

      {category.popularTags && category.popularTags.length > 0 && (
        <div className="category-card-tags">
          {category.popularTags.slice(0, 4).map((tag) => (
            <TagChip key={tag} tag={tag} asLink />
          ))}
        </div>
      )}

      <div className="category-card-footer">
        <Link to={`/category/${category.slug}`} className="category-card-cta">
          <span>Explore Category</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default CategoryCard;
