import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import LanguageSwitcher from './LanguageSwitcher.astro';
import HomePage from './HomePage.astro';
import Logo from './Logo.astro';
import ProductCard from './ProductCard.astro';
import ProductInquiry from './ProductInquiry.astro';

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

  it('hides the Naver button without a listing and labels a Coupang search as such', async () => {
    const html = await render(ProductCard, { ...card, coupangUrl: 'https://www.coupang.com/np/search?q=x' });
    expect(html).not.toContain('products.viewOnNaver');
    expect(html).toContain('data-i18n-aria-label="products.viewOnCoupang"');
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

describe('ProductInquiry', () => {
  it('is the #inquiry section with the shared form', async () => {
    const html = await render(ProductInquiry);
    expect(html).toMatch(/<section id="inquiry"/);
    expect(html).toMatch(/<form id="inquiry-form"[^>]*method="post"/);
    expect(html).toContain('제품 문의하기');
  });
});

describe('HomePage', () => {
  it('renders the products, the inquiry section and contact links from contact.ts', async () => {
    const html = await render(HomePage);
    expect(html).toContain('id="products"');
    expect(html).toContain('data-inquiry-form');
    expect(html).toContain('href="mailto:sales@gvac.co.kr"');
    expect(html).toContain('href="tel:01085257025"');
    expect(html).toContain('id="btnKO"');
  });
});
