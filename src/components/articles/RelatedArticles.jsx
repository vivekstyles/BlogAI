import React from 'react';
import ArticleCard from './ArticleCard';

/**
 * "Related articles" section shown at the end of an article.
 */
export function RelatedArticles({ articles = [], title = 'Related articles' }) {
  if (!articles.length) return null;

  return (
    <section className="article-related" aria-labelledby="related-articles-title">
      <h2 id="related-articles-title" className="article-related-title">
        {title}
      </h2>
      <div className="article-grid">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} headingLevel={3} showTags={false} />
        ))}
      </div>
    </section>
  );
}

export default RelatedArticles;
