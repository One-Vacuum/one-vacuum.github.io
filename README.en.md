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
- `npm test` passes (inquiry form validation, email format and sending)
- Inquiry form: an empty submit shows errors; on localhost a submit shows the email preview and sends nothing

## Adding Images

> **Image size optimization**: Use small file sizes for product images whenever possible. JPG format is recommended over PNG for smaller file sizes. Large images affect page load speed and GitHub repository size.

### Company Logo

- Header/footer wordmark: `src/components/Logo.astro` (inline SVG — follows the text colour; only the dot in the O uses the brand blue)
- Logo file: `public/images/logo.svg`
- Link-preview image (1200×630): `public/images/logo.png`

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

## Inquiry Form (Email)

Submitting the "Product Inquiry" form emails **sales@gvac.co.kr** through [FormSubmit](https://formsubmit.co). GitHub Pages is static (no server), so the site uses this no-account form-to-email relay.

- **Email format:** subject `[원베큠 홈페이지] 제품 문의 — company · name`; the body is a table (회사명, 담당자/이름, 연락처, 이메일, 제품명 · 품번, 문의 내용, 접수 시각, 문의 언어 — Korean labels for the owner). Hitting "Reply" answers the customer directly.
- **One-time activation (required):** after deploy, the first submission makes FormSubmit send an "Activate Form" email to sales@gvac.co.kr. Click its button once; later submissions are then delivered. Submissions made before activation are kept for 30 days and delivered after it.
- **Local testing:** on localhost nothing is sent; a preview of the email the owner would receive is shown instead. To test a real send, run the command below. Without `PUBLIC_INQUIRY_TO` it goes to sales@gvac.co.kr.
  ```bash
  PUBLIC_INQUIRY_LIVE=true PUBLIC_INQUIRY_TO=you@example.com npm run dev
  ```
- **Spam:** submissions that fill the hidden honeypot field are dropped.
- **Files:** `src/components/ProductInquiry.astro` (markup), `src/lib/inquiry.ts` (validation, email format, sending), `src/lib/inquiry-form.ts` (browser behaviour); text lives under `inquiry.*` in `src/i18n/ui.ts`

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
