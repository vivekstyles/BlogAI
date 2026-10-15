import React from 'react';
import BlogCard from './BlogCard';
import './BlogGrid.css';

export function BlogGrid({
  blogs = [],
  onTagClick = null,
  showCategory = true,
  className = '',
}) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <div className={`blog-grid ${className}`}>
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id || blog.slug}
          blog={blog}
          onTagClick={onTagClick}
          showCategory={showCategory}
        />
      ))}
    </div>
  );
}

export default BlogGrid;
