import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import LanguageSwitcher from './LanguageSwitcher.astro';
import { existsSync, readdirSync } from 'node:fs';
import HomePage from './HomePage.astro';
import Hero from './Hero.astro';
import Logo from './Logo.astro';
import ProductCard from './ProductCard.astro';
import ProductTicker from './ProductTicker.astro';
import { cutoutUrl, loadProducts } from '../lib/products';

const render = async (component: Parameters<AstroContainer['renderToString']>[0], props = {}) =>
  (await AstroContainer.create()).renderToString(component, { props });

const card = {
  partNumber: 'L13005',
  nameKo: 'LVO130, 5L',
  nameEn: 'LVO130, 5L',
  image: '/products/images/L13005LVO1305L.jpg',
  price: '₩161,000',
  rawPrice: 161000,
  category: 'oil',
};

describe('ProductCard', () => {
  it('links to both stores in a new tab with safe rel and translatable names', async () => {
    const html = await render(ProductCard, {
      ...card,
      naverUrl: 'https://smartstore.naver.com/onevacuum/products/1',
      coupangUrl: 'https://www.coupang.com/vp/products/2',
      coupangIsExact: true,
    });
    expect(html).toContain('href="https://smartstore.naver.com/onevacuum/products/1"');
    expect(html).toContain('href="https://www.coupang.com/vp/products/2"');
    expect(html.match(/rel="noopener noreferrer"/g)).toHaveLength(2);
    expect(html).toContain('aria-label="네이버 스토어" data-i18n-aria-label="products.viewOnNaver"');
    expect(html).toContain('aria-label="쿠팡에서 보기" data-i18n-aria-label="products.viewOnCoupangExact"');
    expect(html).toContain('data-alt-en="LVO130, 5L"');
  });

  it('shows the category as a translatable chip, and BEST only for best sellers', async () => {
    const html = await render(ProductCard, { ...card, category: 'oil-filter' });
    expect(html).toMatch(/<span class="product-cat" data-i18n="products.filterOilFilter"[^>]*>오일 필터<\/span>/);
    expect(html).not.toContain('product-best');
    expect(await render(ProductCard, { ...card, bestSeller: true })).toContain('class="product-best"');
  });

  it('hides the Naver button without a listing and labels a Coupang search as such', async () => {
    const html = await render(ProductCard, { ...card, coupangUrl: 'https://www.coupang.com/np/search?q=x' });
    expect(html).not.toContain('products.viewOnNaver');
    expect(html).toContain('data-i18n-aria-label="products.viewOnCoupang"');
  });

  it('multiplies a photo onto the well, but shows a cut-out as is with its own shadow', async () => {
    const photo = await render(ProductCard, card);
    expect(photo).toMatch(/<img src="\/products\/images\/L13005LVO1305L\.jpg"[^>]*class="[^"]*mix-blend-multiply/);
    expect(photo).not.toContain('product-cutout');
    const cut = await render(ProductCard, { ...card, cutout: '/products/cutouts/x.webp' });
    expect(cut).toMatch(/<img src="\/products\/cutouts\/x\.webp"[^>]*class="[^"]*product-cutout/);
    expect(cut).not.toContain('mix-blend');
  });
});

describe('product cut-outs', () => {
  const products = loadProducts();

  it('are found for the filters that have one, never for oils', () => {
    const filter = products.find((p) => p.partNumber === '971431120')!;
    expect(cutoutUrl(filter)).toBe('/products/cutouts/971431120Exhaust.filterSV300BSV630B.webp');
    const oilsWithCutout = products.filter((p) => p.category === 'oil' && cutoutUrl(p));
    expect(oilsWithCutout).toEqual([]);
  });

  it('each belong to a product photo', () => {
    const stems = new Set(products.map((p) => p.image.replace(/\.[^.]+$/, '')));
    const orphans = readdirSync('public/products/cutouts').filter((f) => !stems.has(f.replace(/\.webp$/, '')));
    expect(orphans).toEqual([]);
  });
});

describe('Logo', () => {
  it('is an inline SVG that follows the text colour', async () => {
    const html = await render(Logo, { class: 'h-4' });
    expect(html).toMatch(/<svg[^>]*role="img"[^>]*aria-label="One Vacuum"/);
    expect(html).toContain('fill="currentColor"');
  });
});

describe('LanguageSwitcher', () => {
  it('keeps the visible KO / EN text as the accessible name', async () => {
    const html = await render(LanguageSwitcher);
    expect(html).toMatch(/<button id="btnKO"[^>]*>KO<\/button>/);
    expect(html).not.toMatch(/<button id="btnKO"[^>]*aria-label/);
  });
});

describe('HomePage', () => {
  it('renders the products and the contact links from contact.ts, with no inquiry form', async () => {
    const html = await render(HomePage);
    expect(html).toContain('id="products"');
    expect(html).not.toContain('<form');
    expect(html).toContain('href="mailto:sales@gvac.co.kr"');
    expect(html).toContain('href="tel:01085257025"');
    expect(html).toContain('id="btnKO"');
  });
});

describe('Hero', () => {
  const products = loadProducts();

  it('uses cut-out photos that exist in public/images/hero', async () => {
    const html = await render(Hero);
    const srcs = [...html.matchAll(/src="(\/images\/hero\/[^"]+)"/g)].map((m) => m[1]);
    expect(srcs.length).toBeGreaterThan(0);
    for (const src of srcs) expect(existsSync(`public${src}`), src).toBe(true);
  });

  it('links each catalogue count to the matching category filter', async () => {
    const html = await render(Hero);
    expect(html).toMatch(new RegExp(`data-filter-link="all"[^>]*>\\s*<span class="hero-stat-n"[^>]*>${products.length}<`));
    const oil = products.filter((p) => p.category === 'oil').length;
    expect(html).toMatch(new RegExp(`data-filter-link="oil"[^>]*>\\s*<span class="hero-stat-n"[^>]*>${oil}<`));
    for (const id of ['oil-filter', 'vacuum-filter']) expect(html).toContain(`data-filter-link="${id}"`);
  });
});

describe('ProductTicker', () => {
  it('lists each oil series once, in numeric order, hidden from assistive tech', async () => {
    const html = await render(ProductTicker);
    expect(html).toContain('aria-hidden="true"');
    const first = html.slice(0, html.indexOf('</ul>'));
    const names = [...first.matchAll(/<span[^>]*>(LVO\d+)<\/span>/g)].map((m) => m[1]);
    expect(names.length).toBeGreaterThan(5);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual([...names].sort((a, b) => Number(a.slice(3)) - Number(b.slice(3))));
  });
});
