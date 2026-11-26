# One Vacuum

Company brochure website built with Astro + Tailwind CSS.

한국어: [README.md](README.md)

---

## Local Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Steps to Run Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   - http://localhost:4321
   - Single page with client-side KO/EN language toggle in the header

4. **Test production build** (recommended before merging)
   ```bash
   npm run build
   npm run preview
   ```

### Verify Before Merge Checklist

- `npm run dev` starts without errors
- Page loads correctly (http://localhost:4321)
- Language switch works (KO = Korean, EN = English)
- All product images display
- Naver/Coupang buy buttons on product cards work
- Product search and sorting works
- Mobile responsive layout works
- `npm run build` completes without errors
- `npm test` passes
- `npm run check` passes (type check, needs Node 22 from `.tool-versions`)
- If you changed the files both sites share (language switch, CI, …), `scripts/check-shared.sh ../top-vacuum.github.io` passes (both sites use the same files)

## Adding Images

> **Image size optimization**: Use small file sizes for product images whenever possible. JPG format is recommended over PNG for smaller file sizes. Large images affect page load speed and GitHub repository size.

> **Consistent product framing**: after adding or replacing a product photo, run `scripts/normalize-product-images.py <file>` (usage in the file header). It centres the product on a white square at 84% of the frame, so every card shows products at the same size.

> **Filter cut-outs**: after adding or replacing a filter photo (oil or vacuum filter), also run `scripts/build-product-cutouts.py <file>` after the framing script (usage in the file header; the first run downloads a ~1 GB model). White filters vanish into the grey photo well, so the card shows the transparent cut-out from `public/products/cutouts/` instead. Without one, the card shows the photo itself.

### Company Logo

- Header/footer wordmark: `src/components/Logo.astro` (inline SVG — follows the text colour; only the dot in the O uses the brand blue)
- Logo file: `public/images/logo.svg`
- To regenerate the logo: `scripts/build-wordmark.py` (usage in the file header) — don't hand-edit the paths
- Link-preview image (1200×630): `public/images/logo.png`
- Hero bottles (transparent cut-outs): `public/images/hero/` — if one of those product photos changes, regenerate with `scripts/build-hero-cutouts.py` (usage in the file header)

### Favicon

Favicon files are located at:
```
public/images/favicon/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
└── android-chrome-512x512.png
```

## Managing Products

Everything is in one folder: `public/products/`

```
public/products/
├── products.json      ← Product data (part number, names, category, price)
├── cutouts/           ← Transparent filter cut-outs (generated, don't edit)
└── images/            ← Product images
    ├── product-1.png
    ├── product-2.png
    └── ...
```

### To Add a New Product:

1. **Add your product image** to `public/products/images/`

2. **Edit `public/products/products.json`** - add a new entry:
   ```json
   {
     "partNumber": "ABC123",
     "image": "your-image.jpg",
     "nameKo": "제품 이름",
     "nameEn": "Product Name",
     "descriptionKo": "제품 설명 (optional)",
     "descriptionEn": "Product description (optional)",
     "category": "oil",
     "price": 50000,
     "bestSeller": false,
     "naverUrl": "https://smartstore.naver.com/onevacuum/products/123",
     "coupangUrl": "https://www.coupang.com/vp/products/456"
   }
   ```
   - `partNumber`: product part number (required)
   - `category`: `oil`, `oil-filter`, or `vacuum-filter`
   - `price`: integer in KRW (e.g. 50000 → displayed as ₩50,000)
   - `bestSeller`: set to `true` to show BEST badge and prioritize in default sort
   - `naverUrl` (optional): Naver SmartStore product page link, wired to the "Naver" button (green dot) on the product card. The button is hidden when absent.
   - `coupangUrl` (optional): Coupang product page link. When omitted, a Coupang **search link** built from the product name is generated automatically (Coupang blocks automated harvesting of exact product URLs, so a search link is the default)

3. **Commit and push** - website updates automatically!

### To Remove a Product:

1. Delete the image from `public/products/images/`
2. Remove the entry from `products.json`

### If No Products:

Set `products.json` to `[]` and the website will show "Products Coming Soon..."

## Deployment

Pushing to `main` runs the tests (`npm test`) and the build, then deploys to GitHub Pages. Opening a PR runs the same tests and build in CI (`.github/workflows/ci.yml`).

### First-time GitHub Pages Setup

1. Go to repository **Settings** > **Pages**
2. Under "Build and deployment", select **GitHub Actions**
3. Push to `main` branch to trigger deployment
4. Site will be live at: https://onevacuum.kr

## SEO

Search-engine optimization assets are generated automatically at build time.

- **`sitemap.xml`** — `@astrojs/sitemap` generates `sitemap-index.xml` on every build
- **`robots.txt`** — lives at `public/robots.txt` and points crawlers to the sitemap
- **Meta tags** — `BaseLayout.astro` includes canonical URL, Open Graph (link previews on KakaoTalk/Facebook), Twitter card, and JSON-LD structured data

### Registering the site with search engines (manual, one-time)

The code assets alone won't get the site indexed quickly — the domain owner must register it.

1. In [Google Search Console](https://search.google.com/search-console), add `onevacuum.kr` as a **Domain** property and verify ownership via a DNS TXT record
2. Use **URL Inspection** > `https://onevacuum.kr/` > **Request Indexing**
3. Submit `https://onevacuum.kr/sitemap-index.xml` under **Sitemaps**
4. Register `onevacuum.kr` in [Naver Search Advisor](https://searchadvisor.naver.com/) > **Webmaster Tools** (Naver has no DNS verification — ownership is confirmed via the `naver-site-verification` meta tag in `BaseLayout.astro` `<head>`). After deploy, verify ownership, then submit `https://onevacuum.kr/sitemap-index.xml` under **Request > Submit Sitemap**. Removing the meta tag revokes ownership.
