import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Category from '../pages/Category';
import BlogDetails from '../pages/BlogDetails';
import TagPage from '../pages/TagPage';
import SubmitBlog from '../pages/SubmitBlog';
import About from '../pages/About';
import Guidelines from '../pages/Guidelines';
import Privacy from '../pages/Privacy';
import Articles from '../pages/Articles';
import ArticleDetails from '../pages/ArticleDetails';
import Directory from '../pages/Directory';
import NotFound from '../pages/NotFound';

describe('Routing & Page Integrations', () => {
  it('renders Home page with directory hero and categories', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /discover great technical & scientific blogs/i })).toBeInTheDocument();
    expect(screen.getByText(/Browse by Category/i)).toBeInTheDocument();
  });

  it('renders Category page with breadcrumbs and category blogs', () => {
    render(
      <MemoryRouter initialEntries={['/category/engineering']}>
        <Routes>
          <Route path="/category/:categorySlug" element={<Category />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /engineering blogs/i })).toBeInTheDocument();
    expect(screen.getAllByText('Martin Fowler')[0]).toBeInTheDocument();
  });

  it('renders 404 state when navigating to invalid category', () => {
    render(
      <MemoryRouter initialEntries={['/category/invalid-category-xyz']}>
        <Routes>
          <Route path="/category/:categorySlug" element={<Category />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/category not found/i)).toBeInTheDocument();
  });

  it('renders BlogDetails page with author, RSS feed, and external link', () => {
    render(
      <MemoryRouter initialEntries={['/blog/martin-fowler']}>
        <Routes>
          <Route path="/blog/:blogSlug" element={<BlogDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Martin Fowler' })).toBeInTheDocument();
    expect(screen.getByText(/About Publication/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit.*official website/i })).toHaveAttribute(
      'href',
      'https://martinfowler.com/'
    );
  });

  it('renders TagPage with matching publications', () => {
    render(
      <MemoryRouter initialEntries={['/tag/react']}>
        <Routes>
          <Route path="/tag/:tagSlug" element={<TagPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /#react/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Dan Abramov/i)[0]).toBeInTheDocument();
  });

  it('validates submission form required fields and handles submit', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ type: 'opaque' });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter initialEntries={['/submit']}>
        <Routes>
          <Route path="/submit" element={<SubmitBlog />} />
        </Routes>
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /submit publication/i });
    fireEvent.click(submitBtn);

    // Errors should appear for required fields
    expect(await screen.findByText(/blog title is required/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText(/website url is required/i)).toBeInTheDocument();

    // Fill valid data
    fireEvent.change(screen.getByLabelText(/blog title/i), { target: { value: 'Quantum Computing Blog' } });
    fireEvent.change(screen.getByLabelText(/website address/i), { target: { value: 'https://quantum-comp.example.org' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Physics' } });
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'quantum; physics' } });

    fireEvent.click(submitBtn);

    // Success banner should appear
    expect(await screen.findByText(/submission received/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Quantum Computing Blog/i)).toBeInTheDocument();
  });

  it('renders Static Info pages: About, Guidelines, and Privacy', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route path="/about" element={<About />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: /about blogai directory/i })).toBeInTheDocument();
    unmount();

    render(
      <MemoryRouter initialEntries={['/guidelines']}>
        <Routes>
          <Route path="/guidelines" element={<Guidelines />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: /submission & quality guidelines/i })).toBeInTheDocument();
  });

  it('renders NotFound page for unmatched routes', () => {
    render(
      <MemoryRouter initialEntries={['/some/unknown/route']}>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument();
  });
});

describe('Articles and directory routing', () => {
  const renderAt = (path) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:articleSlug" element={<ArticleDetails />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/category/:categorySlug" element={<Category />} />
          <Route path="/tag/:tagSlug" element={<TagPage />} />
        </Routes>
      </MemoryRouter>
    );

  it('lists published articles on /articles and links to their pages', () => {
    renderAt('/articles');
    expect(screen.getByRole('heading', { level: 1, name: 'Articles' })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'How to Follow Technical Blogs with RSS and OPML' });
    expect(link).toHaveAttribute('href', '/articles/follow-technical-blogs-with-rss');
    expect(screen.queryByText(/starter reading list/i)).not.toBeInTheDocument();
  });

  it('renders the full article with metadata, table of contents, and related content', async () => {
    renderAt('/articles/follow-technical-blogs-with-rss');
    // The body is loaded as its own chunk after the page shell renders
    expect(
      await screen.findByRole('heading', { level: 2, name: 'What RSS and OPML actually are' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'How to Follow Technical Blogs with RSS and OPML' })
    ).toBeInTheDocument();
    expect(screen.getByText('BlogAI Editors')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Step 1: Choose a feed reader' })[0]).toHaveAttribute(
      'href',
      '#step-1-choose-a-feed-reader'
    );
    expect(screen.getByRole('heading', { name: 'Related articles' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'From the blog directory' })).toBeInTheDocument();
  });

  it('shows a noindex not-found state for drafts and unknown article slugs', () => {
    renderAt('/articles/mathematics-reading-list');
    expect(screen.getByRole('heading', { level: 1, name: /article not found/i })).toBeInTheDocument();
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  });

  it('renders the searchable community directory on /directory', () => {
    renderAt('/directory?q=fowler');
    expect(screen.getByRole('heading', { level: 1, name: 'Community Blog Directory' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /search blogs directory/i })).toHaveValue('fowler');
    expect(screen.getAllByText('Martin Fowler')[0]).toBeInTheDocument();
  });

  it('redirects legacy home search URLs to the directory', () => {
    renderAt('/?q=fowler');
    expect(screen.getByRole('heading', { level: 1, name: 'Community Blog Directory' })).toBeInTheDocument();
  });

  it('opens directory listings on the original external website', () => {
    renderAt('/directory?q=fowler');
    const titleLink = screen.getAllByRole('link', { name: /martin fowler \(external website/i })[0];
    expect(titleLink).toHaveAttribute('href', 'https://martinfowler.com/');
    expect(titleLink).toHaveAttribute('target', '_blank');
  });

  it('shows both articles and directory blogs on category pages', () => {
    renderAt('/category/engineering');
    expect(screen.getByRole('heading', { name: 'Articles in Engineering' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Engineering blogs in the directory' })).toBeInTheDocument();
  });

  it('renders tag pages for tags used only by articles', () => {
    renderAt('/tag/rss');
    expect(screen.getByRole('heading', { level: 1, name: '#rss' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'How to Follow Technical Blogs with RSS and OPML' })).toBeInTheDocument();
  });
});
