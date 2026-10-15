import { test, expect } from '@playwright/test';

test.describe('BlogAI Directory E2E Flow', () => {
  test('loads directory homepage, searches blogs, and filters by category', async ({ page }) => {
    await page.goto('/');

    // Check title and hero
    await expect(page).toHaveTitle(/BlogAI Directory/i);
    await expect(page.locator('h1')).toContainText('Discover Great Technical & Scientific Blogs');

    // Search for 'Martin Fowler'
    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('Martin Fowler');
    await expect(page.locator('text=Showing 1 of')).toBeVisible();
    await expect(page.locator('.blog-card h3')).toContainText('Martin Fowler');

    // Clear search
    await page.getByRole('button', { name: /clear search query/i }).click();

    // Click Category pill 'Mathematics'
    await page.getByRole('button', { name: 'Mathematics' }).first().click();
    await expect(page.locator('.blog-card h3').first()).toBeVisible();

    // Navigate to blog details
    await page.locator('.blog-internal-link').first().click();
    await expect(page.locator('.blog-details-title')).toBeVisible();
    await expect(page.getByRole('link', { name: /visit.*official website/i })).toBeVisible();
  });

  test('submits a blog through community submission form', async ({ page }) => {
    await page.goto('/submit');

    await expect(page.locator('h1')).toContainText('Submit a Blog for Review');

    await page.fill('#field-title', 'Awesome Distributed Labs');
    await page.fill('#field-address', 'https://awesome-dist-labs.example.com');
    await page.fill('#field-feed', 'https://awesome-dist-labs.example.com/rss.xml');
    await page.selectOption('#field-category', 'Engineering');
    await page.fill('#field-tags', 'distributed systems; storage; raft');
    await page.fill('#field-description', 'Practical research into state machine replication and consensus.');

    await page.click('button[type="submit"]');

    await expect(page.locator('.submission-success-banner')).toBeVisible();
    await expect(page.locator('.submission-success-banner')).toContainText('Awesome Distributed Labs');
  });

  test('handles 404 routes gracefully', async ({ page }) => {
    await page.goto('/nonexistent-page-test');
    await expect(page.locator('h1')).toContainText('Page Not Found');
    await page.getByRole('link', { name: /return to home/i }).click();
    await expect(page).toHaveURL('/');
  });
});
