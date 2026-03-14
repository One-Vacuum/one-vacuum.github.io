# CLAUDE.md

This file provides guidance for Claude Code when working on this project.

## Git & Commit Rules

- **NEVER commit directly to `main` branch.** Always create a feature/fix branch and open a PR.
- **NEVER create commits unless explicitly told to do so.**
- Always run `npm run build` before committing to verify no build errors.

## Documentation

- **Keep CLAUDE.md, README.md, and README_EN.md up-to-date** whenever changes occur in the overall codebase (structure, features, commands, etc.).

## Project Overview

One Vacuum (원베큠) — A bilingual (Korean/English) company brochure website built with Astro and Tailwind CSS, hosted on GitHub Pages at https://onevacuum.kr.

## Tech Stack

- **Framework**: Astro 5.x (Static Site Generation)
- **Styling**: Tailwind CSS 3.4 with custom primary color palette (sky blue)
- **Font**: Pretendard (loaded from CDN)
- **i18n**: Path-based routing (`/ko/`, `/en/`) with Korean as default
- **Deployment**: GitHub Pages via GitHub Actions (auto-deploy on push to `main`)

## Project Structure

```
one-vacuum.github.io/
├── src/
│   ├── components/
│   │   ├── Header.astro           # Sticky header with logo, nav, language switcher
│   │   ├── Footer.astro           # Dark footer with contact info & quick links
│   │   ├── Hero.astro             # Hero section with company intro & CTA buttons
│   │   ├── HomePage.astro         # Shared homepage content (products, buy, contact)
│   │   ├── ProductCard.astro      # Reusable product display card
│   │   └── LanguageSwitcher.astro # KO/EN toggle buttons
│   ├── i18n/
│   │   ├── ui.ts                  # All translation strings (KO/EN)
│   │   └── utils.ts               # i18n helper functions (getLangFromUrl, useTranslations, etc.)
│   ├── lib/
│   │   └── products.ts            # Product loading utility (reads public/products/products.json)
│   ├── layouts/
│   │   └── BaseLayout.astro       # Main HTML layout (head, header, footer)
│   ├── pages/
│   │   ├── index.astro            # Root redirect to /ko/
│   │   ├── ko/index.astro         # Korean homepage (delegates to HomePage component)
│   │   └── en/index.astro         # English homepage (delegates to HomePage component)
│   └── styles/
│       └── global.css             # Tailwind imports + custom component classes
├── public/
│   ├── images/logo.png            # Company logo
│   ├── products/
│   │   ├── products.json          # Product data (easy to edit!)
│   │   └── images/                # Product images
│   └── favicon.svg
├── .github/workflows/deploy.yml   # GitHub Pages deployment workflow
├── astro.config.mjs               # Astro configuration (i18n routes, site URL)
├── tailwind.config.mjs            # Tailwind theme (custom colors, fonts)
├── tsconfig.json                  # TypeScript config (path aliases @ → src/)
└── package.json                   # Dependencies and scripts
```

## Architecture Notes

### Page Rendering Flow
1. `/ko/index.astro` and `/en/index.astro` are thin wrappers that pass `lang` to `HomePage.astro`
2. `HomePage.astro` contains all shared page content (products, where-to-buy, contact sections)
3. `BaseLayout.astro` wraps everything with HTML shell, Header, and Footer
4. All user-facing strings come from `src/i18n/ui.ts` via `useTranslations(lang)`

### Product Loading
- Products are loaded at **build time** from `public/products/products.json` via `src/lib/products.ts`
- The `loadProducts(lang)` function reads JSON, sorts by `order`, and returns language-appropriate fields
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
- Root `/` redirects to `/ko/` (default language)
- `getLangFromUrl(url)` extracts language from first path segment
- `useTranslations(lang)` returns a `t(key)` function with Korean fallback
- `switchLang(url, lang)` builds language-switch URLs

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
