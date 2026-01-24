# CLAUDE.md

This file provides guidance for Claude Code when working on this project.

## Project Overview

One Vacuum (원베큠) - A bilingual (Korean/English) company brochure website built with Astro and Tailwind CSS, hosted on GitHub Pages.

## Tech Stack

- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS
- **i18n**: Path-based routing (`/ko/`, `/en/`) with Korean as default
- **Deployment**: GitHub Pages via GitHub Actions

## Project Structure

```
one-vacuum.github.io/
├── src/
│   ├── components/
│   │   ├── Header.astro           # Logo, navigation, language switcher
│   │   ├── Footer.astro           # Contact info, quick links
│   │   ├── Hero.astro             # Hero section with company intro
│   │   ├── ProductCard.astro      # Product display card
│   │   └── LanguageSwitcher.astro # KO/EN toggle
│   ├── data/
│   │   └── products.ts            # Store links configuration
│   ├── i18n/
│   │   ├── ui.ts                  # All translation strings (KO/EN)
│   │   └── utils.ts               # i18n helper functions
│   ├── layouts/
│   │   └── BaseLayout.astro       # Main layout (head, header, footer)
│   ├── pages/
│   │   ├── index.astro            # Root redirect to /ko/
│   │   ├── ko/
│   │   │   └── index.astro        # Korean homepage
│   │   └── en/
│   │       └── index.astro        # English homepage
│   └── styles/
│       └── global.css             # Tailwind imports + custom styles
├── public/
│   ├── images/
│   │   └── logo.png               # Company logo
│   ├── products/                  # Products folder
│   │   ├── products.json          # Product data (easy to edit!)
│   │   └── images/                # Product images
│   │       ├── product-1.png
│   │       └── ...
│   └── favicon.svg
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Pages deployment workflow
├── astro.config.mjs               # Astro configuration
├── tailwind.config.mjs            # Tailwind theme configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## Key Files for Content Updates

| What to Update | File(s) |
|----------------|---------|
| **Products** | `public/products/products.json` + images |
| Store URLs | `src/data/products.ts` → `storeLinks` |
| UI text translations | `src/i18n/ui.ts` |
| Contact info | `src/components/Footer.astro`, page files |
| Company logo | `public/images/logo.png` |

## Managing Products (For Non-Technical Editors)

All product files are in one folder: `public/products/`

### To Add a New Product:

1. **Add your product image** to `public/products/images/`

2. **Edit `public/products/products.json`** - add a new entry:
   ```json
   {
     "image": "my-product.png",
     "nameKo": "제품 이름",
     "nameEn": "Product Name",
     "descriptionKo": "제품 설명",
     "descriptionEn": "Product description",
     "order": 1
   }
   ```

3. **Commit and push** - the website will update automatically

### To Remove a Product:

1. Delete the image from `public/products/images/`
2. Remove the entry from `products.json`

### To Reorder Products:

Change the `order` number (lower numbers appear first)

### If No Products Exist:

Set `products.json` to an empty array `[]` and the website will display "Products Coming Soon..." message automatically.

## Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server (http://localhost:4321)
npm run build  # Build for production (outputs to ./dist)
npm run preview # Preview production build locally
```

## i18n Architecture

- Root `/` redirects to `/ko/` (default language)
- Language paths: `/ko/...` for Korean, `/en/...` for English
- Translations stored in `src/i18n/ui.ts`
- Use `useTranslations(lang)` to get translation function
- Use `getLangFromUrl(Astro.url)` to detect current language

## Styling Conventions

- Uses Tailwind CSS utility classes
- Custom components defined in `src/styles/global.css`:
  - `.container-custom` - Max-width container with padding
  - `.section` - Standard section padding
  - `.btn-primary` / `.btn-secondary` - Button styles
- Primary color: `primary-600` (#0284c7, sky blue)

## Deployment

Automatic deployment via GitHub Actions on push to `main` branch. Requires GitHub Pages to be configured with "GitHub Actions" as the build source.
