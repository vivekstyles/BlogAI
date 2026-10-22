import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Compass } from 'lucide-react';
import { articleService } from '../services/articleService';
import { buildArticleSchema, buildArticleBreadcrumbSchema } from '../utils/articleSchema';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import ArticleMeta from '../components/articles/ArticleMeta';
import ArticleContent from '../components/articles/ArticleContent';
import TableOfContents from '../components/articles/TableOfContents';
import RelatedArticles from '../components/articles/RelatedArticles';
import BlogCard from '../components/blogs/BlogCard';
import TagChip from '../components/tags/TagChip';
import './ArticleDetails.css';

export function ArticleDetails() {
  const { articleSlug } = useParams();
  const article = useMemo(() => articleService.getArticleBySlug(articleSlug), [articleSlug]);
  const relatedArticles = useMemo(() => articleService.getRelatedArticles(article), [article]);
  const relatedBlogs = useMemo(() => articleService.getRelatedBlogs(article), [article]);
  const [content, setContent] = useState({ slug: null, html: null, failed: false });

  useEffect(() => {
    if (!article) return undefined;
    let cancelled = false;
    articleService
      .getArticleContent(article.slug)
      .then((html) => {
        if (!cancelled) setContent({ slug: article.slug, html, failed: html == null });
      })
      .catch(() => {
        if (!cancelled) setContent({ slug: article.slug, html: null, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [article]);

  if (!article) {
    return (
      <div className="container article-not-found">
        <SEOHead
          title="Article Not Found"
          description="The requested article could not be found on BlogAI."
          robots="noindex, follow"
        />
        <div className="article-not-found-card">
          <AlertCircle size={40} className="not-found-icon" aria-hidden="true" />
          <h1>Article Not Found</h1>
          <p>We could not find an article at &ldquo;/articles/{articleSlug}&rdquo;.</p>
          <Link to="/articles" className="btn btn-primary">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>All articles</span>
          </Link>
        </div>
      </div>
    );
  }

  const primaryCategory = article.categories[0];
  const showToc = article.showToc && article.toc.length > 0;

  return (
    <div className="article-page">
      <SEOHead
        title={article.seoTitle || article.title}
        description={article.description}
        canonicalUrl={article.canonicalUrl}
        type="article"
        image={article.image}
        article={{
          publishedTime: article.publishedAt,
          modifiedTime: article.updatedAt,
          author: article.author,
          section: primaryCategory?.name,
          tags: article.tags.map((t) => t.name),
        }}
        jsonLd={[buildArticleSchema(article), buildArticleBreadcrumbSchema(article)]}
      />

      <div className="container">
        <Breadcrumbs items={[{ label: 'Articles', path: '/articles' }, { label: article.title }]} />
      </div>

      <article className="container article-layout">
        <header className="article-header">
          <div className="article-header-labels">
            <span className="article-header-kind">Article</span>
            {article.categories.map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}`} className="article-header-category">
                {c.name}
              </Link>
            ))}
          </div>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-lead">{article.description}</p>
          <ArticleMeta article={article} labelDates className="article-header-meta" />
        </header>

        {article.image && (
          <figure className="article-featured-image">
            <img src={article.image} alt={article.imageAlt} />
          </figure>
        )}

        <div className={`article-body-grid ${showToc ? 'has-toc' : ''}`}>
          {showToc && (
            <aside className="article-toc-aside" aria-label="Table of contents">
              <details className="article-toc-mobile">
                <summary>On this page</summary>
                <TableOfContents items={article.toc} idPrefix="toc-mobile" />
              </details>
              <TableOfContents items={article.toc} idPrefix="toc-desktop" className="article-toc-desktop" />
            </aside>
          )}

          <div className="article-main">
            {content.slug !== article.slug ? (
              <div className="article-content-loading" role="status" aria-label="Loading article" />
            ) : content.failed ? (
              <p className="article-content-error" role="alert">
                This article could not be loaded. Please check your connection and reload the page.
              </p>
            ) : (
              <ArticleContent html={content.html} />
            )}

            {article.tags.length > 0 && (
              <footer className="article-footer">
                <h2 className="article-footer-heading">Tags</h2>
                <div className="article-footer-tags">
                  {article.tags.map((t) => (
                    <TagChip key={t.slug} tag={t.name} asLink />
                  ))}
                </div>
              </footer>
            )}
          </div>
        </div>
      </article>

      <div className="container article-after">
        <RelatedArticles articles={relatedArticles} />

        {relatedBlogs.length > 0 && (
          <section className="article-related-blogs" aria-labelledby="related-blogs-title">
            <div className="article-related-blogs-header">
              <h2 id="related-blogs-title" className="article-related-title">
                From the blog directory
              </h2>
              <Link to="/directory" className="article-related-more">
                <Compass size={15} aria-hidden="true" />
                <span>Browse all blogs</span>
              </Link>
            </div>
            <p className="article-related-note">
              External blogs on similar topics, curated by the community.
            </p>
            <div className="article-related-blogs-grid">
              {relatedBlogs.map((b) => (
                <BlogCard key={b.id} blog={b} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ArticleDetails;
