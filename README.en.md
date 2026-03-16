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
- Language toggle works (tap either KO or EN to switch)
- All product images display
- Product card detail toggle works on click
- Product search and sorting works
- Mobile responsive layout works
- `npm run build` completes without errors

## Adding Images

### Company Logo

Place your logo file at:
```
public/images/logo.png
```
- Supported formats: PNG, JPG, SVG

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
     "image": "your-image.png",
     "nameKo": "제품 이름",
     "nameEn": "Product Name",
     "descriptionKo": "제품 설명 (optional)",
     "descriptionEn": "Product description (optional)",
     "category": "oil",
     "price": 50000,
     "bestSeller": false
   }
   ```
   - `partNumber`: product part number (required)
   - `category`: `oil`, `oil-filter`, or `vacuum-filter`
   - `price`: integer in KRW (e.g. 50000 → displayed as ₩50,000)
   - `bestSeller`: set to `true` to show BEST badge and prioritize in default sort

3. **Commit and push** - website updates automatically!

### To Remove a Product:

1. Delete the image from `public/products/images/`
2. Remove the entry from `products.json`

### If No Products:

Set `products.json` to `[]` and the website will show "Products Coming Soon..."

## Deployment

The site auto-deploys to GitHub Pages when you push to `main`.

### First-time GitHub Pages Setup

1. Go to repository **Settings** > **Pages**
2. Under "Build and deployment", select **GitHub Actions**
3. Push to `main` branch to trigger deployment
4. Site will be live at: https://onevacuum.kr
