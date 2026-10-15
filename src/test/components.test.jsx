import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import BlogCard from '../components/blogs/BlogCard';
import TagChip from '../components/tags/TagChip';
import CategoryNav from '../components/categories/CategoryNav';
import Breadcrumbs from '../components/layout/Breadcrumbs';

describe('Component: SearchBar', () => {
  it('renders input with value and handles change events', () => {
    const handleChange = vi.fn();
    render(<SearchBar value="Distributed" onChange={handleChange} />);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('Distributed');

    fireEvent.change(input, { target: { value: 'Microservices' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('triggers clear callback on clear button click', () => {
    const handleClear = vi.fn();
    render(<SearchBar value="Distributed" onClear={handleClear} />);

    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalled();
  });
});

describe('Component: BlogCard', () => {
  const sampleBlog = {
    id: 'test-1',
    title: 'Distributed Systems Patterns',
    slug: 'distributed-systems-patterns',
    address: 'https://patterns.dev/',
    category: 'Engineering',
    categorySlug: 'engineering',
    feed: 'https://patterns.dev/feed.xml',
    tags: ['architecture', 'scalability'],
    description: 'Practical architectural patterns for scalable systems.',
    author: 'Ada Lovelace',
    status: 'active',
  };

  it('renders all blog card elements including tags and external links', () => {
    render(
      <MemoryRouter>
        <BlogCard blog={sampleBlog} />
      </MemoryRouter>
    );

    expect(screen.getByText('Distributed Systems Patterns')).toBeInTheDocument();
    expect(screen.getByText(/Practical architectural patterns/i)).toBeInTheDocument();
    expect(screen.getByText('patterns.dev')).toBeInTheDocument();
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('architecture')).toBeInTheDocument();
    expect(screen.getByText('scalability')).toBeInTheDocument();
    expect(screen.getByText('RSS')).toBeInTheDocument();

    const visitLink = screen.getByRole('link', { name: /visit distributed systems patterns external website/i });
    expect(visitLink).toHaveAttribute('href', 'https://patterns.dev/');
    expect(visitLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

describe('Component: TagChip', () => {
  it('renders interactive button when onClick is provided', () => {
    const handleClick = vi.fn();
    render(<TagChip tag="devops" count={5} onClick={handleClick} />);

    const chipBtn = screen.getByRole('button', { name: /filter by tag: devops/i });
    expect(chipBtn).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    fireEvent.click(chipBtn);
    expect(handleClick).toHaveBeenCalledWith('devops');
  });

  it('renders navigable router link when asLink is true', () => {
    render(
      <MemoryRouter>
        <TagChip tag="devops" asLink />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /view blogs tagged with devops/i });
    expect(link).toHaveAttribute('href', '/tag/devops');
  });
});

describe('Component: CategoryNav', () => {
  const categories = [
    { name: 'Engineering', slug: 'engineering', count: 10 },
    { name: 'Physics', slug: 'physics', count: 8 },
  ];

  it('renders dynamic categories and indicates active state', () => {
    const handleSelect = vi.fn();
    render(
      <CategoryNav
        categories={categories}
        activeCategorySlug="engineering"
        totalCount={18}
        onSelectCategory={handleSelect}
      />
    );

    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Physics')).toBeInTheDocument();

    const engBtn = screen.getByRole('button', { name: /engineering/i });
    expect(engBtn).toHaveAttribute('aria-pressed', 'true');

    const physBtn = screen.getByRole('button', { name: /physics/i });
    fireEvent.click(physBtn);
    expect(handleSelect).toHaveBeenCalledWith('physics');
  });
});

describe('Component: Breadcrumbs', () => {
  it('renders accessible breadcrumb hierarchy', () => {
    const items = [
      { label: 'Engineering', path: '/category/engineering' },
      { label: 'Martin Fowler' },
    ];

    render(
      <MemoryRouter>
        <Breadcrumbs items={items} />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Martin Fowler')).toBeInTheDocument();
  });
});
