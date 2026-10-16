# UI_RULES.md — Website UI Design and Implementation Rules

## 1. Core Objective

Maintain and improve the existing React + Vite website UI using a consistent, modern, accessible, responsive design system.

The website has two primary content areas:

1. **Articles:** Original articles published by the website owner and readable in full on the same website.
2. **Blog Directory:** External blogs submitted by the owner or community members and linked to their original websites.

The interface must clearly distinguish these two content types while maintaining a consistent visual identity.

Before changing anything, inspect the existing application, components, routes, stylesheets, and design patterns. Improve the existing implementation rather than rebuilding the application unnecessarily.

## 2. Mandatory Theme Rules

Use these colors throughout the application:

- Primary accent: `#6ab668`
- Primary background: `#171717`
- Primary foreground: `#e5e5e5`
- Secondary background: `#202020`
- Tertiary background: `#292929`
- Secondary text: `#b3b3b3`
- Border: `#383838`
- Accent hover: `#7bc879`
- Muted accent background: `#294329`

Define colors centrally using CSS custom properties. Reuse the existing theme variables if they already exist.

### Strict color restrictions

- Remove blue theme accents from all application UI.
- Do not introduce new blue color values.
- Use green for primary actions, active navigation, interactive links, focus indicators, and selected states.
- Use neutral colors for backgrounds, cards, borders, and secondary text.
- Preserve necessary error and warning colors where appropriate for usability.
- Never use gradients anywhere in the UI.

## 3. Absolute No-Gradient Rule

Do not use:

- `linear-gradient()`
- `radial-gradient()`
- `conic-gradient()`
- Gradient text, buttons, backgrounds, borders, shadows, or overlays.
- Gradient-based SVG fills.
- Decorative effects designed to imitate gradients.

Use solid colors, subtle borders, and restrained shadows instead.

Check CSS, CSS Modules, inline styles, SVG assets, component themes, and responsive styles for prohibited gradients.

## 4. Design Principles

- Prefer a clean, minimalist, content-first interface.
- Maintain consistent spacing, typography, border radii, and alignment.
- Establish a clear visual hierarchy between page headings, section headings, body text, and metadata.
- Avoid unnecessary decoration, oversized components, and excessive animations.
- Use green accents purposefully rather than filling large areas with green.
- Ensure text remains readable during long reading sessions.
- Use consistent layouts across related pages.
- Avoid introducing new UI libraries unless absolutely necessary.
- Follow the existing styling architecture.

## 5. Global Layout Rules

### Header
- Use a solid dark background.
- Display the site identity clearly.
- Provide navigation for Articles and Blog Directory.
- Include category navigation and a Submit a Blog action where appropriate.
- Clearly indicate the active navigation item using green.
- Ensure the mobile navigation is accessible and responsive.

### Main content
- Use consistent horizontal padding and content widths.
- Keep reading content narrower than directory grids where appropriate.
- Maintain consistent spacing between page sections.
- Prevent horizontal overflow.
- Ensure the primary content appears clearly against the dark background.

### Footer
- Use the established dark theme.
- Include relevant navigation and informational links.
- Keep the layout simple and responsive.
- Do not introduce blue accents or gradients.

## 6. Articles UI Rules

Articles are original content published on this website. Visitors must be able to read the complete article without being redirected to an external website.

### Article listing page
- Display article cards in a responsive grid or list.
- Include the article title, short description, category, tags, author, and publication date when available.
- Display a featured image only when one exists.
- Make the article title and card navigation link to the internal article page.
- Use green accents for interactive links and hover states.
- Keep metadata visually secondary to the title.

### Article reading page
- Prioritize readability and comfortable long-form reading.
- Use a centered article container with an appropriate maximum width.
- Provide a clear title, description, author, publication date, and category where available.
- Use a readable body font size and line height.
- Establish consistent spacing between headings, paragraphs, lists, images, code blocks, and tables.
- Style inline links in green with clear hover and focus states.
- Ensure code blocks and tables work on small screens.
- Support a table of contents for long articles when appropriate.
- Provide breadcrumbs, related articles, and article navigation where useful.
- Keep article content visually distinct from navigation and metadata.
- Do not invent missing authors, dates, images, or other metadata.

### Article content
- Preserve the semantic structure of article content.
- Use proper heading levels without skipping levels unnecessarily.
- Ensure images have meaningful alternative text when appropriate.
- Keep embedded content responsive.
- Avoid placing the entire article inside a visually restrictive card.
- Prevent long URLs, code, or tables from breaking the page layout.

## 7. Blog Directory UI Rules

The directory contains external blog listings, not full articles hosted by this website.

### Directory page
- Display blog listings using reusable cards.
- Include the blog title, domain, description, tags, category, and RSS availability when available.
- Link the blog title or primary visit action to the original external website.
- Clearly distinguish external website links from internal navigation.
- Do not make external blog listings look like first-party articles.
- Do not fabricate descriptions, ratings, authors, or verification indicators.

### Directory interactions
- Preserve real-time search.
- Preserve category and tag filtering.
- Keep active filters visually clear using green accents.
- Display useful empty states when no blogs match.
- Maintain keyboard accessibility and responsive layouts.

## 8. Search, Categories, and Tags

- Keep the search bar visually prominent and consistent across relevant pages.
- Use solid dark input backgrounds and neutral borders.
- Use green for focus, active controls, and selected filters.
- Ensure placeholder text is readable.
- Preserve existing controlled-input behavior.
- Use reusable category and tag components.
- Never hardcode category names inside generic reusable components.
- Make clickable tags and category filters behave consistently.
- Preserve URL-based filtering and navigation if already implemented.

## 9. Buttons, Links, and Forms

### Buttons
- Primary buttons use a solid green background.
- Select a foreground color that passes contrast testing.
- Secondary buttons use neutral backgrounds or borders.
- Disabled buttons must remain visually distinguishable.
- Do not use gradient effects.

### Links
- Use green for important interactive links.
- Provide visible hover and keyboard focus states.
- Distinguish internal links from external destinations when appropriate.
- Avoid relying on color alone to communicate link purpose.

### Forms
- Use consistent labels, spacing, borders, and input heights.
- Display validation errors close to the relevant fields.
- Provide clear success, loading, and error states.
- Ensure forms work on mobile and with keyboard navigation.
- Do not change form submission logic as part of a visual-only update.

## 10. Component Reusability

- Keep reusable components generic and configurable through props.
- Avoid duplicating layout and styling logic.
- Separate presentation from data processing and business logic.
- Use shared components for cards, tags, breadcrumbs, buttons, metadata, and empty states where appropriate.
- Keep article components separate from directory-specific components when their responsibilities differ.
- Reuse common design tokens across both content areas.
- Do not introduce unnecessary abstractions or rewrite working components without a clear benefit.

## 11. Responsive Design

Verify the application at:

- Mobile: 320–480px.
- Tablet: 768–1024px.
- Desktop: 1280px and above.

Ensure:

- Navigation works on small screens.
- Search controls fit available space.
- Article text remains readable.
- Directory grids adapt to the viewport.
- Cards do not overflow their containers.
- Images, tables, and code blocks remain responsive.
- Dialogs and forms fit smaller screens.
- No content is clipped or hidden accidentally.

Use responsive CSS rather than fixed dimensions wherever practical.

## 12. Accessibility

- Use semantic HTML elements.
- Maintain a logical heading hierarchy.
- Provide visible keyboard focus indicators.
- Ensure sufficient text and control contrast.
- Add accessible labels to inputs and icon-only controls.
- Support keyboard navigation.
- Provide meaningful alternative text for informative images.
- Respect reduced-motion preferences.
- Do not communicate selected, error, or success states through color alone.

## 13. SEO and Content Presentation

- Preserve existing SEO metadata and structured data.
- Ensure article pages have a clear title and readable article content.
- Keep internal article navigation crawlable.
- Use descriptive link text.
- Preserve canonical URLs and breadcrumb navigation.
- Do not add duplicate headings or hidden keyword content for SEO.
- Do not change indexing behavior during a visual-only task unless explicitly requested.
- Do not replace article content with summaries or placeholders.

## 14. Performance and Stability

- Avoid unnecessary dependencies.
- Avoid unnecessary re-renders and expensive visual effects.
- Preserve existing routing, search, filters, and data-loading behavior.
- Avoid layout shifts caused by missing image dimensions.
- Lazy-load below-the-fold images where appropriate.
- Do not render large amounts of content unnecessarily.
- Preserve existing error handling and loading states.

## 15. UI Change Workflow

Before implementation:

1. Inspect the current application and identify its styling system.
2. Review existing reusable components and page layouts.
3. Identify blue colors, gradients, duplicated styles, and inconsistent spacing.
4. Determine which components can be updated without changing functionality.

During implementation:

1. Update centralized theme tokens first.
2. Apply theme changes to shared components.
3. Update article pages and directory pages consistently.
4. Fix responsive and accessibility issues.
5. Remove prohibited colors and gradients.
6. Avoid unrelated business-logic changes.

After implementation:

1. Inspect all existing routes.
2. Test hover, focus, active, selected, disabled, loading, and error states.
3. Test search, category filtering, tag filtering, and article navigation.
4. Check mobile, tablet, and desktop layouts.
5. Run existing tests and the production build.
6. Search stylesheets and inspect rendered styles for prohibited blue accents and gradients.
7. Report any remaining issues honestly.

## 16. Non-Negotiable Constraints

- Do not rebuild the application from scratch.
- Do not remove existing functionality.
- Do not break existing URLs or data flows.
- Do not mix first-party article content with external directory records.
- Do not redirect readers away from the site when opening first-party articles.
- Do not make external directory listings appear to be full articles hosted on this site.
- Do not introduce blue theme accents.
- Do not use gradients anywhere in the website UI.
- Do not fabricate content or metadata.
- Do not claim tests passed unless they were executed.

## 17. Definition of Done

The UI task is complete when:

- Articles and the external blog directory are clearly distinguished.
- Both content areas share a consistent design system.
- The required green-and-dark palette is applied throughout.
- No blue theme accents or gradients remain in the website UI.
- All existing interactions and routes continue to work.
- The layout is responsive and accessible.
- Existing tests and the production build pass, or failures are documented.
- The final report lists the files changed, checks performed, and any outstanding issues.
