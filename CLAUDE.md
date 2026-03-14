# CLAUDE.md

This file provides guidance for Claude Code when working on this project.

## Git & Commit Rules

- **NEVER commit directly to `main` branch.** Always create a feature/fix branch and open a PR.
- **NEVER create commits unless explicitly told to do so.**
- Always run `npm run build` before committing to verify no build errors.

## Documentation

- **Keep CLAUDE.md, README.md, and README.en.md up-to-date** whenever changes occur in the overall codebase (structure, features, commands, etc.).

## Project Overview

One Vacuum (원베큠) — A bilingual (Korean/English) company brochure website built with Astro and Tailwind CSS, hosted on GitHub Pages at https://onevacuum.kr.

## Tech Stack

- **Framework**: Astro 5.x (Static Site Generation)
- **Styling**: Tailwind CSS 3.4 with custom primary color palette (sky blue)
- **Font**: Pretendard (loaded from CDN)
- **i18n**: Client-side toggle via `data-i18n` attributes (Korean default, single page)
- **Theme**: Dark/light mode toggle with Tailwind `dark:` classes (default: light)
- **Deployment**: GitHub Pages via GitHub Actions (auto-deploy on push to `main`)

## Project Structure

```
one-vacuum.github.io/
├── src/
│   ├── components/
│   │   ├── Header.astro           # Sticky header with logo, nav, lang/theme toggles
│   │   ├── Footer.astro           # Dark footer with contact info & quick links
│   │   ├── Hero.astro             # Hero section with company intro & CTA buttons
│   │   ├── HomePage.astro         # Main page (products, buy, contact) + client-side JS
│   │   ├── ProductCard.astro      # Bilingual product card with data attributes
│   │   └── LanguageSwitcher.astro # KO/EN toggle buttons
│   ├── i18n/
│   │   └── ui.ts                  # All translation strings (KO/EN)
│   ├── lib/
│   │   └── products.ts            # Product loading utility (reads public/products/products.json)
│   ├── layouts/
│   │   └── BaseLayout.astro       # Main HTML layout (head, header, footer)
│   ├── pages/
│   │   └── index.astro            # Single page entry (renders HomePage)
│   └── styles/
│       └── global.css             # Tailwind imports + custom component classes
├── public/
│   ├── images/logo.png            # Company logo
│   ├── products/
│   │   ├── products.json          # Product data (easy to edit!)
│   │   └── images/                # Product images
│   └── favicon.svg
├── .github/workflows/deploy.yml   # GitHub Pages deployment workflow
├── astro.config.mjs               # Astro configuration (site URL, Tailwind)
├── tailwind.config.mjs            # Tailwind theme (custom colors, fonts)
├── tsconfig.json                  # TypeScript config (path aliases @ → src/)
└── package.json                   # Dependencies and scripts
```

## Architecture Notes

### Page Rendering Flow
1. `index.astro` renders `HomePage.astro` directly (single page, no routing)
2. `HomePage.astro` contains all page content (products, buy, contact) and client-side JS for language switching + category filtering
3. `BaseLayout.astro` wraps everything with HTML shell, Header, and Footer
4. All translatable elements use `data-i18n` attributes; client-side `setLang()` swaps text from `src/i18n/ui.ts`
5. Product names/descriptions use `data-name-ko`/`data-name-en` and `data-desc-ko`/`data-desc-en` attributes

### Product Loading
- Products are loaded at **build time** from `public/products/products.json` via `src/lib/products.ts`
- The `loadProducts()` function reads JSON, sorts by `order`, and returns bilingual product data
- Empty JSON `[]` shows "Products Coming Soon..." message
- Products are filterable by category via client-side JS tabs (All / Oil / Oil Filter / Vacuum Filter)
- Prices are displayed in KRW (₩) format

### Product JSON Schema
Each entry in `public/products/products.json`:
```json
{
  "image": "my-product.png",
  "nameKo": "제품 이름",
  "nameEn": "Product Name",
  "descriptionKo": "제품 설명 (optional)",
  "descriptionEn": "Product description (optional)",
  "category": "oil | oil-filter | vacuum-filter",
  "price": 50000,
  "order": 1
}
```
- `image`: filename in `public/products/images/`
- `category`: must be one of `oil`, `oil-filter`, `vacuum-filter`
- `price`: integer in KRW (no decimals)
- `order`: lower numbers appear first

### i18n System
- Single page with client-side language toggle (default: Korean)
- All translatable elements have `data-i18n="key"` attributes
- `setLang('ko'|'en')` in `HomePage.astro` script swaps all text at runtime
- Product cards use `data-name-ko`/`data-name-en` for bilingual product names
- Korean is the fallback language if a translation key is missing

### Theme System
- Dark/light mode toggle in header (default: light/day mode)
- Uses Tailwind `dark:` variant with `class` strategy
- Theme preference persisted in `localStorage`
- `<html>` element gets `class="dark"` toggled

## Key Files for Content Updates

| What to Update | File(s) |
|----------------|---------|
| **Products** | `public/products/products.json` + images in `public/products/images/` |
| UI text translations | `src/i18n/ui.ts` |
| Contact info | `src/i18n/ui.ts` (phone, email, address values) |
| Company logo | `public/images/logo.png` |

## Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server (http://localhost:4321)
npm run build  # Build for production (outputs to ./dist)
npm run preview # Preview production build locally
```

## Styling Conventions

- Uses Tailwind CSS utility classes
- Custom components defined in `src/styles/global.css`:
  - `.container-custom` — Max-width container with padding
  - `.section` — Standard section padding
  - `.btn-primary` / `.btn-secondary` — Button styles
- Primary color: `primary-600` (#0284c7, sky blue)
- Responsive breakpoint: `md:` for desktop nav and layout transitions

## Deployment

Automatic deployment via GitHub Actions on push to `main` branch. Requires GitHub Pages to be configured with "GitHub Actions" as the build source.
