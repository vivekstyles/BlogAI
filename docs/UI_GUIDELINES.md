# UI Guidelines: Green & Dark Minimalist Theme

Rules for anyone (human or AI agent) changing the BlogAI interface. Follow them for every new component, page, and style edit.

## Non-negotiable rules

1. **No blue.** Never use blue, indigo, sky, cyan, navy, violet, or purple for any UI element, state, shadow, or icon.
2. **No gradients.** No `linear-gradient()`, `radial-gradient()`, `conic-gradient()`, `repeating-*-gradient()`, SVG `<linearGradient>`/`<radialGradient>`, gradient text, gradient borders, or layered colors that imitate a gradient. Use solid fills, borders, and simple shadows.
3. **No hardcoded colors in components.** Every color comes from a CSS custom property defined in [`src/styles/variables.css`](../src/styles/variables.css). The only exceptions are static assets that cannot read CSS variables: `public/favicon.svg`, `public/manifest.webmanifest`, and the `theme-color` meta tag in `index.html`. Those must use the literal palette values below.
4. **Green guides attention; it does not dominate.** Use the accent for primary actions, links on hover, selected states, and focus. Keep large surfaces neutral.
5. **Do not add a styling framework** (Tailwind, MUI, styled-components, etc.) to change appearance. Plain CSS files next to each component, using the tokens, is the project's pattern.

## Palette

| Role | Token | Dark (default) |
| --- | --- | --- |
| Accent (primary) | `--color-fg-accent-primary` | `#6ab668` |
| Accent hover | `--color-accent-hover` | `#7bc879` |
| Accent muted surface | `--color-accent-muted` | `#294329` |
| Text on accent | `--color-fg-on-accent` | `#171717` |
| Page background | `--color-bg-neutral-primary` | `#171717` |
| Cards, header, nav, footer | `--color-bg-neutral-secondary` | `#202020` |
| Inputs, elevated, hover surfaces | `--color-bg-neutral-tertiary` | `#292929` |
| Primary text | `--color-fg-neutral-primary` | `#e5e5e5` |
| Secondary text | `--color-fg-neutral-secondary` | `#b3b3b3` |
| Tertiary text, placeholders | `--color-fg-neutral-tertiary` | `#949494` |
| Border | `--color-border-neutral` | `#383838` |
| Strong border (hover) | `--color-border-neutral-strong` | `#4a4a4a` |
| Focus ring | `--color-focus-ring` / `--color-focus-ring-soft` | `#6ab668` / 25% alpha |
| Success | `--color-success` | `#6ab668` |
| Error | `--color-error` | `#f87171` |
| Warning | `--color-warning` | `#fbbf24` |
| RSS (feed actions only) | `--color-rss`, `--color-rss-text`, `--color-rss-muted` | `#fb923c`, `#fdba74`, `#2e2119` |

RSS orange is a deliberate exception: it is the recognizable feed color. Use it only for RSS/OPML controls.

### Semantic aliases

Components use short semantic names that resolve to the palette. Prefer these in component CSS:

| Alias | Resolves to |
| --- | --- |
| `--bg-primary` | page background |
| `--bg-surface` | card/header surface (`#202020`) |
| `--bg-surface-elevated`, `--bg-subtle` | `#292929` |
| `--bg-muted` | `#383838` |
| `--text-primary` / `--text-secondary` / `--text-tertiary` | the three text levels |
| `--border-subtle` / `--border-strong` / `--border-focus` | borders and focus |
| `--brand-primary` / `--brand-primary-hover` | accent / accent hover |
| `--brand-surface` / `--brand-border` / `--brand-text` | muted green surface, green border, green text |
| `--success-*`, `--danger-*`, `--accent-rss-*`, `--badge-*` | status, RSS, and badge sets |

To add a new color, add a palette token in `variables.css` (in both `:root` and `[data-theme='light']`), then alias it if components need a semantic name. Never define colors in component files.

## Themes

- Dark is the default and lives on `:root`. The prerendered HTML has no `data-theme` attribute, so it ships dark.
- Light is opt-in: `Header.jsx` sets `data-theme="light"` on `<html>` and stores `blogai_theme` in `localStorage`. The light block overrides the palette tokens only; aliases follow automatically.
- Any new token must get a light value with at least 4.5:1 contrast on white. The light accent is `#3d7a3b`, not `#6ab668`, for this reason.

## Component patterns

Use the shared classes in [`src/styles/global.css`](../src/styles/global.css) before writing new ones.

| Element | Use | Styling |
| --- | --- | --- |
| Primary action | `.btn .btn-primary` | Solid green, `--color-fg-on-accent` text, hover `--brand-primary-hover` |
| Secondary action | `.btn .btn-secondary` | `--bg-surface`, neutral border, hover `--bg-subtle` |
| Feed action | `.btn .btn-rss` | RSS tokens; hover solid orange with `--color-fg-on-rss` |
| Compact button | add `.btn-sm` | 36px min height |
| Neutral badge | `.badge` | `--badge-*` tokens |
| Accent badge | `.badge .badge-brand` | Muted green surface, green border, `--brand-text` |
| Layout width | `.container` | `--max-width` with 1.5rem gutters |

State conventions:

- **Inactive nav, pills, chips:** `--text-secondary` on `--bg-surface` with `--border-subtle`.
- **Hover:** surface `--bg-subtle`, border `--border-strong`, text `--text-primary`. Links and card titles turn `--brand-primary`.
- **Selected (category pill, active page):** solid `--brand-primary` with `--color-fg-on-accent` text.
- **Selected (tag chip):** `--brand-surface` background, `--brand-border` border, `--brand-text` text.
- **Card hover:** border becomes `--brand-border`; keep shadows neutral black.
- **Inputs, selects, search:** `--bg-surface-elevated` background, `--border-subtle` border. On focus: `--border-focus` border plus `box-shadow: 0 0 0 3px var(--color-focus-ring-soft)`.
- **Errors:** `--color-error` border and message text, always with a text message (never color alone).
- **Disabled:** `opacity: 0.5` and `cursor: not-allowed`.
- **Keyboard focus:** the global `:focus-visible` outline (2px `--border-focus`, 2px offset). Never remove it without an equally visible replacement.
- **Shadows:** only `--shadow-sm` … `--shadow-xl` (neutral black). No colored glows except the focus ring.

## Accessibility

- Minimum 4.5:1 contrast for text, 3:1 for UI boundaries and large text. Measured values in the dark theme:

  | Pair | Ratio |
  | --- | --- |
  | `#e5e5e5` on `#171717` | 14.2 |
  | `#b3b3b3` on `#202020` | 7.8 |
  | `#949494` on `#202020` | 5.4 |
  | `#6ab668` on `#202020` | 6.6 |
  | `#171717` on `#6ab668` | 7.3 |
  | `#7bc879` on `#294329` | 5.4 |

- Use `#171717` (`--color-fg-on-accent`), never white, on green in dark mode. White on `#6ab668` is about 2.6:1.
- Touch targets: buttons, inputs, and selects are at least 44px tall (`responsive.css`).
- Motion: keep animations functional (loading pulse, short transitions). `responsive.css` disables them under `prefers-reduced-motion: reduce`; don't override that.

## Layout and breakpoints

| Width | Behavior |
| --- | --- |
| < 640px | Single-column grids |
| ≥ 640px | Two-column grids |
| ≥ 768px | `.desktop-only` shown, `.mobile-only` hidden |
| 768–1023px | Header still uses the hamburger drawer (overridden in `Header.css`) |
| ≥ 1024px | Full header nav, three-column grids |

- Do not put `backdrop-filter`, `transform`, or `filter` on `.site-header`. Any of them turns the header into the containing block for the `position: fixed` mobile drawer and clips it.
- Check new work at 320px, 375px, 768px, 1024px, and 1280px for horizontal overflow and wrapped nav text.

## Audit before merging UI changes

Run these from the repo root. Each must return nothing:

```bash
grep -rniE 'gradient' src public index.html
```

```bash
grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(' src --include=*.css --include=*.jsx | grep -v 'src/styles/variables.css'
```

```bash
grep -rniE '\b(blue|indigo|navy|cyan|sky|violet|purple)\b' src --include=*.css --include=*.jsx
```

Then:

```bash
npm test
```

```bash
npm run build
```

Finally, open `npm run preview` and check the changed pages in both themes, including hover, focus (Tab key), selected, error, and disabled states.

## Articles vs. directory listings

Visitors must always be able to tell original writing from external links.

| | `ArticleCard` (first-party) | `BlogCard` (external directory blog) |
| --- | --- | --- |
| Frame | 4px `--brand-primary` left rail | Neutral border only |
| Label | Green "Original article" | Gray "External blog" with external-link icon |
| Title link | `/articles/:slug` on this site | The blog's own website, new tab |
| Footer | Date, reading time, "Read article" | "Details" (`/blog/:slug`) and "Visit Website" |

Long-form article bodies use `ArticleContent` (`.article-content` typography, max width 720px). Do not reuse its styles for directory pages.
