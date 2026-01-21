# One Vacuum (원베큠)

Company brochure website built with Astro + Tailwind CSS.

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
   This builds the site and serves it locally to verify the production output.

### Verify Before Merge Checklist

- [ ] `npm run dev` starts without errors
- [ ] Korean page (`/ko/`) loads correctly
- [ ] English page (`/en/`) loads correctly
- [ ] Language switcher works
- [ ] All product images display (or show placeholder)
- [ ] Links to external stores work
- [ ] Mobile responsive layout works
- [ ] `npm run build` completes without errors

## Adding Images

### Company Logo

Place your logo file at:
```
public/images/logo.png
```
- Recommended size: 200x80 pixels (or similar aspect ratio)
- Supported formats: PNG, JPG, SVG

### Product Images

Place product images in the `public/images/products/` folder with these filenames:
```
public/images/products/
├── product-1.png
├── product-2.png
├── product-3.png
├── product-4.png
├── product-5.png
├── product-6.png
├── product-7.png
├── product-8.png
├── product-9.png
└── product-10.png
```
- Recommended size: 400x400 pixels (square)
- Supported formats: JPG, PNG, WebP
- Images will automatically show a placeholder if missing

To change product names or add/remove products, edit `src/data/products.ts`.

## Deployment

The site auto-deploys to GitHub Pages when you push to `main`.

### First-time GitHub Pages Setup

1. Go to repository **Settings** > **Pages**
2. Under "Build and deployment", select **GitHub Actions**
3. Push to `main` branch to trigger deployment
4. Site will be live at: https://one-vacuum.github.io
