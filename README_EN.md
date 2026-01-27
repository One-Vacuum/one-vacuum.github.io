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
   - Korean: http://localhost:4321/ko/
   - English: http://localhost:4321/en/

4. **Test production build** (recommended before merging)
   ```bash
   npm run build
   npm run preview
   ```

### Verify Before Merge Checklist

- `npm run dev` starts without errors
- Korean page (`/ko/`) loads correctly
- English page (`/en/`) loads correctly
- Language switcher works
- All product images display
- Links to external stores work
- Mobile responsive layout works
- `npm run build` completes without errors

## Adding Images

### Company Logo

Place your logo file at:
```
public/images/logo.png
```
- Recommended size: 200x80 pixels
- Supported formats: PNG, JPG, SVG

## Managing Products

Everything is in one folder: `public/products/`

```
public/products/
├── products.json      ← Product data (names, descriptions)
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
     "image": "your-image.png",
     "nameKo": "제품 이름",
     "nameEn": "Product Name",
     "descriptionKo": "제품 설명",
     "descriptionEn": "Product description",
     "order": 5
   }
   ```

3. **Commit and push** - website updates automatically!

### To Remove a Product:

1. Delete the image from `public/products/images/`
2. Remove the entry from `products.json`

### To Reorder Products:

Change the `order` number (lower = appears first)

### If No Products:

Set `products.json` to `[]` and the website will show "Products Coming Soon..."

## Deployment

The site auto-deploys to GitHub Pages when you push to `main`.

### First-time GitHub Pages Setup

1. Go to repository **Settings** > **Pages**
2. Under "Build and deployment", select **GitHub Actions**
3. Push to `main` branch to trigger deployment
4. Site will be live at: https://onevacuum.kr
