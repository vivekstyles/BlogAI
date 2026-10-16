# UI Instructions: Green and Dark Minimalist Theme

## 1. Objective

Update the existing website UI to use a consistent, modern, minimalist dark theme with green accents.

**Primary requirements:**
- Remove all blue theme colors from the website UI.
- Use the specified green, dark background, and foreground colors consistently.
- Do not use gradients anywhere in the website UI.
- Preserve the existing React + Vite architecture, functionality, routes, data, and search/filter behavior.
- Do not rewrite the application from scratch.

## 2. Mandatory Color Palette

Use these colors as the foundation of the design system:

| Purpose | Color |
| --- | --- |
| Primary accent green | `#6ab668` |
| Primary background | `#171717` |
| Primary foreground / text | `#e5e5e5` |
| Secondary background | `#202020` |
| Tertiary background | `#292929` |
| Secondary text | `#b3b3b3` |
| Neutral border | `#383838` |
| Accent hover | `#7bc879` |
| Muted accent background | `#294329` |
| Focus ring | `#6ab668` |
| Success | `#6ab668` |
| Error | `#f87171` |
| Warning | `#fbbf24` |

Define the palette centrally using CSS custom properties:

```css
:root {
  --color-fg-accent-primary: #6ab668;
  --color-bg-neutral-primary: #171717;
  --color-fg-neutral-primary: #e5e5e5;

  --color-bg-neutral-secondary: #202020;
  --color-bg-neutral-tertiary: #292929;
  --color-fg-neutral-secondary: #b3b3b3;
  --color-border-neutral: #383838;

  --color-accent-hover: #7bc879;
  --color-accent-muted: #294329;
  --color-focus-ring: #6ab668;

  --color-success: #6ab668;
  --color-error: #f87171;
  --color-warning: #fbbf24;
}
```

Use the three mandatory colors as the core theme. Secondary colors are allowed only where necessary for status communication, accessibility, and readability. Do not introduce blue as a decorative or interactive theme color.

## 3. Strict No-Blue Policy

Search the project and remove blue colors from the website UI, including:

- CSS and CSS Modules.
- Inline styles and dynamically assigned styles.
- CSS custom properties and theme tokens.
- Tailwind configuration, if present.
- Component-library themes and overrides.
- SVG icons, illustrations, and fills.
- Links, buttons, borders, badges, chips, and shadows.
- Hover, focus, active, selected, disabled, loading, and error states.
- Search fields, navigation, cards, forms, pagination, notifications, dialogs, and tooltips.
- Responsive styles and dark-mode styles.

Replace blue theme accents with `#6ab668` or suitable neutral colors. Do not only update the primary buttons; audit every page and interactive state.

Preserve meaningful status colors when required for usability, but do not use blue as a theme accent.

## 4. Strict No-Gradient Policy

**Gradients are prohibited everywhere in the website UI.**

Remove all uses of:

- `linear-gradient()`
- `radial-gradient()`
- `conic-gradient()`
- Gradient text, buttons, backgrounds, borders, shadows, and overlays.
- Gradient-based SVG fills.
- Decorative gradient image treatments.
- Layered effects intended to imitate gradients.

Do not replace gradients with another gradient technique. Use solid colors, subtle borders, consistent spacing, and simple shadows instead.

Inspect application stylesheets, SVG assets, theme configuration, and rendered UI to confirm that no gradients remain.

## 5. Design Direction

Create a cohesive, professional dark interface that feels clean, content-focused, and comfortable for long reading sessions.

- Use `#171717` as the main page background.
- Use `#202020` for cards, navigation panels, and secondary surfaces.
- Use `#292929` for elevated surfaces, input fields, and selected neutral backgrounds.
- Use `#e5e5e5` for primary text.
- Use `#b3b3b3` for secondary text and descriptions.
- Use `#383838` for subtle borders and separators.
- Use `#6ab668` for primary actions, links, selected states, and important accents.
- Use `#7bc879` for hover states where appropriate.

Use green purposefully to guide attention. Avoid covering large areas with green unnecessarily. Prefer solid fills, restrained shadows, simple borders, and consistent spacing.

## 6. Component-Level Instructions

Update all existing components without breaking their behavior.

### Header and navigation
- Use a solid dark background.
- Use neutral text for inactive navigation links.
- Use green for active navigation, hover states, and important actions.
- Remove blue highlights and gradient decorations.
- Preserve responsive navigation and mobile-menu behavior.

### Search bar
- Use a solid dark input background.
- Use neutral borders and readable text.
- Use green for focus borders, search icons, and active controls.
- Keep placeholder text readable.
- Preserve controlled-input behavior, live search, and keyboard accessibility.

### Blog cards and lists
- Use solid dark card backgrounds.
- Use subtle neutral borders.
- Use green only for important links, hover states, and selected elements.
- Remove blue borders, shadows, and hover effects.
- Keep titles, descriptions, domains, and metadata readable.

### Category navigation
- Use neutral styling for inactive categories.
- Use green to indicate the selected category.
- Make active states clear without gradients.
- Preserve category filtering and URL behavior.

### Tag chips
- Use solid neutral backgrounds.
- Use green text or borders for interactive tags.
- Keep hover and selected states consistent.
- Preserve tag filtering.

### Buttons and forms
- Use solid green for primary action buttons.
- Select a sufficiently contrasting foreground color based on contrast testing.
- Use neutral surfaces for secondary buttons.
- Use green outlines for focus and selected states.
- Keep disabled, error, success, and loading states consistent.
- Do not use blue or gradient effects.

### Footer, dialogs, pagination, and other components
- Apply the same color system across all remaining UI components.
- Remove inconsistent legacy colors.
- Preserve layouts and functionality unless a small UI adjustment is necessary for consistency.

## 7. Centralized Theme Architecture

- Keep theme colors in one central source of truth.
- Use CSS custom properties throughout the application.
- Replace hardcoded legacy colors with the centralized variables where practical.
- Avoid duplicating color definitions across components.
- If a theme provider or component library exists, configure its tokens to match this palette.
- If Tailwind is already configured, update the existing configuration rather than introducing another styling system.
- Do not install a new UI framework solely to change colors.
- Keep the implementation compatible with the current React + Vite architecture.

## 8. Accessibility and Interaction States

- Ensure text remains readable against all backgrounds.
- Verify contrast for primary text, secondary text, links, and buttons.
- Use an accessible foreground color on green buttons based on actual contrast measurements.
- Preserve visible keyboard focus indicators.
- Do not communicate status through color alone.
- Keep hover, focus, active, selected, disabled, and error states visually distinct.
- Respect reduced-motion preferences.
- Avoid adding decorative animations solely for the redesign.

## 9. Responsive Validation

Verify the updated UI at these viewport sizes:

- Mobile: 320–480px.
- Tablet: 768–1024px.
- Desktop: 1280px and above.

Inspect the header, mobile navigation, search bar, blog cards, category filters, tag chips, pagination, dialogs, and forms. Ensure the new styling does not cause overflow, clipped text, broken layouts, or inaccessible controls.

## 10. Automated Theme Audit

After implementation:

1. Search the application for legacy blue color values and blue-related theme tokens.
2. Search stylesheets for all CSS gradient functions.
3. Inspect CSS variables, inline styles, component themes, SVG assets, and responsive styles.
4. Run the application and inspect all routes and interactive states.
5. Check computed styles for buttons, links, inputs, cards, navigation, and badges.
6. Run the existing test suite and production build.
7. Fix visual regressions introduced by the changes.
8. Report any remaining exceptions explicitly.

Where practical, add an automated theme check that fails when prohibited gradient functions are detected in application stylesheets. Also inspect rendered computed styles, because stylesheet text searches alone may miss inherited or dynamically applied colors.

Do not remove legitimate colors from unrelated documentation or third-party content unless they affect the website UI.

## 11. Constraints

- Do not rewrite the application from scratch.
- Do not remove existing features.
- Do not change business logic, routing, data processing, or search behavior.
- Do not introduce gradients under any circumstances.
- Do not leave blue accents in hover, focus, selected, disabled, or responsive states.
- Avoid broad, destructive search-and-replace operations; review changes for unintended effects.
- Do not claim an audit or test passed unless it was actually performed.

## 12. Definition of Done

The redesign is complete only when:

- The website consistently uses the specified green-and-dark palette.
- No blue theme accents remain in the website UI.
- No gradients remain in the website UI.
- Existing routes, features, search, and filters continue to work.
- Components remain responsive and accessible.
- The test suite and production build pass, or any failures are documented.
- The theme audit has been performed and its results reported.

At completion, summarize the files changed, theme tokens introduced, audit checks performed, test/build results, and any remaining issues.
