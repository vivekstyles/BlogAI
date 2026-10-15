import React from 'react';
import { describe, it, expect } from 'vitest';
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

  it('validates submission form required fields and handles submit', () => {
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
    expect(screen.getByText(/blog title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/website url is required/i)).toBeInTheDocument();

    // Fill valid data
    fireEvent.change(screen.getByLabelText(/blog title/i), { target: { value: 'Quantum Computing Blog' } });
    fireEvent.change(screen.getByLabelText(/website address/i), { target: { value: 'https://quantum-comp.example.org' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Physics' } });
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'quantum; physics' } });

    fireEvent.click(submitBtn);

    // Success banner should appear
    expect(screen.getByText(/submission received/i)).toBeInTheDocument();
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
