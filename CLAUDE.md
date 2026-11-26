# CLAUDE.md

This file provides guidance for Claude Code when working on this project.

## Git & Commit Rules

- **NEVER commit directly to `main` branch.** Always create a feature/fix branch and open a PR.
- **NEVER create commits unless explicitly told to do so.**
- Always run `npm run build` before committing to verify no build errors.

## Documentation

- **IMPORTANT: Every time you make changes to the codebase, update CLAUDE.md, README.md, and README.en.md** to reflect the changes. This includes changes to project structure, features, commands, architecture, product schema, styling conventions, or any other documented aspect. All three files must stay in sync and accurately describe the current state of the project.

## Project Overview

One Vacuum (원베큠) — A bilingual (Korean/English) company brochure website built with Astro and Tailwind CSS, hosted on GitHub Pages at https://onevacuum.kr.

**Copy rule:** all site text comes from the company's existing copy in `src/i18n/ui.ts` and the product data. Do not invent claims, services, slogans, or technical data; design changes may only rearrange existing text. Functional UI text (button labels, accessible names) is fine.

## Shared Code with top-vacuum.github.io

Both sites ship the same KO/EN runtime and tooling. These files must stay **byte-identical** in both repos — change both, then run `scripts/check-shared.sh ../top-vacuum.github.io` (it `cmp`s the list below):
`src/i18n/client.ts`, `src/i18n/client.test.ts`, `src/i18n/ui.test.ts`, `vitest.config.ts`, `scripts/check-shared.sh`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.tool-versions`.

## Tech Stack

- **Framework**: Astro 5.x (Static Site Generation)
- **Styling**: Tailwind CSS 3.4 with a brand palette taken from the wordmark (ink `#111216`, accent blue `#1F5BFF`, warm-neutral paper surfaces)
- **Node**: 22, pinned in `.tool-versions` (asdf; CI reads the same file). `astro check` fails on older Node
- **Fonts**: Pretendard (body, loaded from CDN) + Archivo (small uppercase Latin labels, Google Fonts). The wordmark itself is outlined SVG, so it does not depend on a web font
- **i18n**: Client-side toggle via `data-i18n` attributes (Korean default, single page)
- **Theme**: Dark/light mode toggle with Tailwind `dark:` classes (default: light)
- **Deployment**: GitHub Pages via GitHub Actions (auto-deploy on push to `main`)

## Project Structure

```
one-vacuum.github.io/
├── src/
│   ├── components/
│   │   ├── Header.astro           # Sticky header with wordmark, nav, lang/theme toggles
│   │   ├── Footer.astro           # Light footer: wordmark, quick links, contact, business info
│   │   ├── Hero.astro             # Hero panel: headline, CTAs, catalogue counts (filter links), cut-out bottles on the ring-and-dot motif, price + store cards
│   │   ├── HomePage.astro         # Main page (products, buy, contact) + client-side JS
│   │   ├── Logo.astro             # Wordmark as inline SVG (follows currentColor; dot uses the accent)
│   │   ├── ProductCard.astro      # Framed product card: photo well, BEST + category chips, Naver/Coupang buttons
│   │   ├── ProductTicker.astro    # Moving band of the oil series names (LVO…) under the hero
│   │   └── LanguageSwitcher.astro # KO / EN segmented switch
│   ├── i18n/
│   │   ├── ui.ts                  # All translation strings (KO/EN)
│   │   ├── client.ts              # KO/EN runtime: applyLang(), translate() (shared)
│   │   ├── client.test.ts         # applyLang tests (shared)
│   │   └── ui.test.ts             # KO/EN key parity, no empty strings (shared)
│   ├── lib/
│   │   ├── products.ts            # Product loading utility (reads public/products/products.json)
│   │   └── contact.ts             # Phone / email values (ui.ts reads them) + tel:/mailto: helpers
│   ├── layouts/
│   │   └── BaseLayout.astro       # Main HTML layout (head, header, footer)
│   ├── pages/
│   │   └── index.astro            # Single page entry (renders HomePage)
│   └── styles/
│       └── global.css             # Tailwind imports + custom component classes
├── public/
│   ├── images/
│   │   ├── logo.svg               # Wordmark file (same outlines as Logo.astro)
│   │   ├── logo.png               # 1200×630 social preview (og:image / JSON-LD logo)
│   │   ├── placeholder-product.svg # Fallback for missing product images
│   │   ├── hero/                  # Transparent cut-outs of the hero bottles (scripts/build-hero-cutouts.py)
│   │   └── favicon/               # Favicon set (ring + dot mark on ink)
│   ├── products/
│   │   ├── products.json          # Product data (easy to edit!)
│   │   ├── cutouts/               # Transparent filter cut-outs (scripts/build-product-cutouts.py)
│   │   └── images/                # Product images
│   └── robots.txt                 # Crawler rules + sitemap location
├── .github/workflows/
│   ├── deploy.yml                 # Type check + test + build + deploy to GitHub Pages on push to main (per-job least-privilege permissions)
│   └── ci.yml                     # Type check + test + build on every pull request (read-only token)
├── scripts/check-shared.sh        # Checks the shared files are identical to the other site's
├── .tool-versions                 # Node version (asdf); CI reads it too
├── scripts/build-wordmark.py      # Regenerates Logo.astro + public/images/logo.svg from Archivo
├── scripts/build-hero-cutouts.py  # Regenerates public/images/hero/*.webp from the product photos
├── scripts/normalize-product-images.py # Frames every product photo the same way (run after adding one)
├── scripts/build-product-cutouts.py # Cuts the filter photos out of their background (rembg)
├── vitest.config.ts               # Vitest via Astro's Vite config (getViteConfig)
├── astro.config.mjs               # Astro configuration (site URL, Tailwind)
├── tailwind.config.mjs            # Tailwind theme (custom colors, fonts)
├── tsconfig.json                  # TypeScript config (path aliases @ → src/)
└── package.json                   # Dependencies and scripts
```

## Architecture Notes

### Page Rendering Flow
1. `index.astro` renders `HomePage.astro` directly (single page, no routing)
2. `HomePage.astro` contains all page content (products, buy, contact) and client-side JS for language switching, category filtering, search, and sorting
3. `BaseLayout.astro` wraps everything with HTML shell, Header, and Footer
4. All translatable elements use `data-i18n` attributes; client-side `setLang()` swaps text from `src/i18n/ui.ts`
5. Product names/descriptions use `data-name-ko`/`data-name-en` and `data-desc-ko`/`data-desc-en` attributes

### Product Loading
- Products are loaded at **build time** from `public/products/products.json` via `src/lib/products.ts`
- The `loadProducts()` function reads JSON, sorts by `order`, and returns bilingual product data
- Empty JSON `[]` shows "Products Coming Soon..." message
- Products are filterable by category via the category tiles (All / Oil / Oil Filter / Vacuum Filter); each tile shows its item count and a representative product photo in a disc (set in `HomePage.astro`). The selected tile turns ink (snow in dark mode). The hero's catalogue counts (`data-filter-link`) select the same filter before scrolling to the grid
- Products are searchable by name or part number
- Products can be sorted by price (ascending/descending); default sort shows best sellers first
- Prices are displayed in KRW (₩) format
- Pagination via "Show More" button (8 items per page)

### Product JSON Schema
Each entry in `public/products/products.json`:
```json
{
  "partNumber": "ABC123",
  "image": "my-product.jpg",
  "nameKo": "제품 이름",
  "nameEn": "Product Name",
  "descriptionKo": "제품 설명 (optional)",
  "descriptionEn": "Product description (optional)",
  "category": "oil | oil-filter | vacuum-filter",
  "price": 50000,
  "bestSeller": true,
  "naverUrl": "https://smartstore.naver.com/onevacuum/products/123",
  "coupangUrl": "https://www.coupang.com/vp/products/456"
}
```
- `partNumber`: product part number displayed on the card
- `image`: filename in `public/products/images/` (prefer JPG for smaller file size)
- `category`: must be one of `oil`, `oil-filter`, `vacuum-filter`
- `price`: integer in KRW (no decimals)
- `bestSeller`: optional, shows BEST badge and prioritizes in default sort
- `naverUrl`: optional, exact Naver SmartStore product page URL. Rendered as the card's "네이버" button; the button is hidden when absent.
- `coupangUrl`: optional, exact Coupang product page URL. When absent, `coupangUrl(product)` in `src/lib/products.ts` generates a Coupang **search** link from the product name (Coupang blocks automated harvesting of exact per-product URLs). Oil products search as `LEYBONOL <model> <size>`, filters as `LEYBOLD <name>`.

### Product Card Interaction
- Cards are **single-sided** (no flip/back): a framed tile with an image well (an arc of the ring motif in the corner; the photo, or the filter's cut-out when one exists), then part number, name, price, and store links. Hovering lifts the card and zooms the photo slightly. Best sellers get an accent `BEST` pill; every card shows its category as a chip (`products.filter*` keys, so it follows the language).
- Store links render at the bottom of every card as two neutral `.store-btn` buttons — **네이버 (Naver)** shown only when `naverUrl` is set, and **쿠팡 (Coupang)** always present (exact `coupangUrl` or generated search link). The brand is signalled by a small colour dot (Naver `#03C75A`, Coupang `#346AFF`); the button text stays ink-on-paper for contrast. The buttons sit side by side (each `flex-1`) and stack vertically below `480px` so labels stay legible on the 2-column mobile grid. The Coupang button's `aria-label` reflects whether the link is an exact page ("쿠팡에서 보기") or a search ("쿠팡에서 검색"), driven by the `coupangIsExact` prop.
- The card itself is not clickable; only the store buttons are interactive (`<a target="_blank">`).

### i18n System
- Single page with client-side language toggle (default: Korean)
- KO sets Korean, EN sets English (segmented switch; the active side gets `lang-active`)
- All translatable elements have `data-i18n="key"` attributes
- `setLang()` in `HomePage.astro` updates the KO/EN buttons and calls `applyLang(lang, { htmlKeys })` from `src/i18n/client.ts`, which re-translates every tagged element (the shared, tested part); site-only extras stay in `setLang()`
- Product cards use `data-name-ko`/`data-name-en` for bilingual product names
- For translations that contain HTML (e.g. the hero headline's `<br>`), add `data-i18n-html` and render with `set:html`; the switcher then uses `innerHTML` (only ever fed constants from `ui.ts`)
- Accessible names follow the language too: `data-i18n-aria-label="key"` (nav landmarks, theme/menu/clear/close buttons, search and sort, store buttons) and product image `alt` via `data-alt-ko`/`data-alt-en`
- `data-i18n-html` is honoured only for keys in the `HTML_KEYS` set passed to `applyLang()` (the strings that contain markup); other keys always use `textContent`
- Korean is the fallback language if a translation key is missing

### Theme System
- Dark/light mode toggle in header (default: light/day mode)
- Uses Tailwind `dark:` variant with `class` strategy
- The preference is not persisted (reload returns to light)
- The sun/moon icon swaps via `dark:` classes, no JS; the button's `aria-pressed` reflects dark mode
- `<html>` element gets `class="dark"` toggled

## Image Optimization

- **Prefer JPG over PNG** for product images — significantly smaller file sizes
- Keep product images as small as possible to improve page load speed and minimize repository size
- Logo and favicon files can remain PNG for transparency support
- **After adding or replacing a product photo, run `scripts/normalize-product-images.py <file>`** (setup in its header). It rewrites the photo as a 1000×1000 white square with the product centred at 84% of the frame and the background faded to white, so every card shows products at the same size. Photos where it misjudges the product (white bodies, translucent caps) get a threshold in its `SOLID_OVERRIDES`
- **Then, for a filter photo, run `scripts/build-product-cutouts.py <file>`** (rembg, Python ≤ 3.13; setup in its header). It writes a transparent WebP to `public/products/cutouts/` with the same framing; `cutoutUrl()` in `src/lib/products.ts` finds it at build time and the card and category tile show it instead of the photo. Without a cut-out the photo is used. It uses BiRefNet; photos where that cuts off part of the product use ISNet via `MODEL_OVERRIDES` (the gaskets in 18972 / 18973). Look at every new cut-out on the well before committing

## Key Files for Content Updates

| What to Update | File(s) |
|----------------|---------|
| **Products** | `public/products/products.json` + images in `public/products/images/` |
| UI text translations | `src/i18n/ui.ts` |
| Contact info | `src/lib/contact.ts` (phone, email) and `src/i18n/ui.ts` (address) |
| Company logo | `src/components/Logo.astro` (header/footer), `public/images/logo.svg`, `public/images/logo.png` (social preview) |
| Favicon | `public/images/favicon/` |

## Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server (http://localhost:4321)
npm run build  # Build for production (outputs to ./dist)
npm run preview # Preview production build locally
npm test       # Run unit + component tests (Vitest)
npm run check  # Type-check .astro and .ts files (astro check; Node from .tool-versions)
```

## Styling Conventions

- Uses Tailwind CSS utility classes
- Colour tokens (`tailwind.config.mjs`): `ink` (text, primary buttons), `paper` / `paper-well` / `paper-dim` (light surfaces and image wells), `line` / `line-strong` (dividers / control borders, 3:1), `naver` / `coupang` (store dots), `accent` (`#1F5BFF`, logo dot and active states; `accent-light` on dark), `night-*` and `snow-*` (dark mode). There is no `primary-*` palette any more
- Custom components defined in `src/styles/global.css`: `.container-custom`, `.section`, `.section-title` / `.section-sub`, `.eyebrow`, `.focus-ring`, `.btn-primary` / `.btn-secondary`, `.icon-btn`, `.nav-link`, `.lang-btn`, `.cat-tile` / `.cat-count` / `.cat-disc` (category filter tile), `.field` (search/sort), `.product-card` / `.product-well` / `.product-cutout` / `.product-best` / `.product-cat`, `.store-btn`, `.hero-panel` (dot grid) / `.hero-stat` / `.hero-rise` / `.hero-float` / `.hero-spin` (hero), `.ticker*` (oil series band). Animations stop under `prefers-reduced-motion`. `.focus-ring` adds a transparent outline so focus stays visible in forced-colors (high contrast) mode
- **Product photos** are multiplied onto light wells (`mix-blend-multiply`, `paper-well` `#F0F0ED`, `paper-dim` in dark mode): the photo's pure white background (from the normalize script) takes the well's colour and the product keeps its shading. Any off-white background pixel shows as a box, so only normalized photos go in. White products take the well's colour under multiply and wash out, so filters use transparent cut-outs instead (`.product-cutout`, no blend, with a drop shadow). Don't use `mix-blend-darken`: it erases everything lighter than the well
- `font-display` (Archivo) is only for small uppercase Latin labels; Korean and body text use Pretendard
- **Logo:** `Logo.astro` and `public/images/logo.svg` are generated by `scripts/build-wordmark.py` (Archivo wdth 125 / wght 640, +60 tracking, O = ring + dot); setup and usage are in the script header. Regenerate rather than hand-edit. `logo.png` and the favicons are rendered from those SVGs (browser screenshot, then ImageMagick resize)
- Responsive breakpoint: `md:` for desktop nav and layout transitions

## SEO

- **Sitemap**: Generated automatically at build time by `@astrojs/sitemap` (configured in `astro.config.mjs`). Outputs `sitemap-index.xml` + `sitemap-0.xml` to `dist/`. The `site` URL in `astro.config.mjs` must stay accurate for correct absolute URLs.
- **robots.txt**: Static file at `public/robots.txt`; allows all crawlers and references `https://onevacuum.kr/sitemap-index.xml`.
- **Meta tags**: `BaseLayout.astro` head includes canonical URL, Open Graph (social/KakaoTalk previews), Twitter card, and JSON-LD `Organization` structured data. These derive from `Astro.site` and the `site.title`/`site.description` i18n strings — keep those in sync when updating branding.
- **Search Console (manual)**: Code assets alone do not get the site indexed. The domain owner must register `onevacuum.kr` in Google Search Console (Domain property, DNS verification), request indexing, and submit the sitemap. See README for steps.
- **Naver Search Advisor (manual)**: For Korean search traffic, register `onevacuum.kr` in [Naver Search Advisor](https://searchadvisor.naver.com/) (웹마스터 도구). Naver does not support DNS verification — ownership is verified via the `naver-site-verification` meta tag in `BaseLayout.astro` `<head>`. After deploy, verify ownership, then submit `https://onevacuum.kr/sitemap-index.xml` under 요청 → 사이트맵 제출. The verification meta tag must remain in the head or ownership lapses.

## Deployment

Automatic deployment via GitHub Actions on push to `main` branch (type check, tests, then build, then deploy; only the deploy job has `pages: write` / `id-token: write`). `ci.yml` runs the type check, tests and build on every pull request with a read-only token. Requires GitHub Pages to be configured with "GitHub Actions" as the build source.
