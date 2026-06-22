import fs from 'node:fs';
import path from 'node:path';

export type Category = 'oil' | 'oil-filter' | 'vacuum-filter';

export interface Product {
  partNumber: string;
  image: string;
  nameKo: string;
  nameEn: string;
  descriptionKo?: string;
  descriptionEn?: string;
  category: Category;
  price: number;
  bestSeller?: boolean;
  /** Exact Naver SmartStore product page URL (optional). */
  naverUrl?: string;
  /** Exact Coupang product page URL (optional). When absent, a Coupang
   *  search link is generated from the product name via `coupangUrl()`. */
  coupangUrl?: string;
}

export function loadProducts(): Product[] {
  let raw: Product[] = [];
  try {
    const filePath = path.join(process.cwd(), 'public/products/products.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    raw = JSON.parse(fileContent);
  } catch {
    return [];
  }

  return raw;
}

export function formatPrice(price: number): string {
  return '₩' + price.toLocaleString('ko-KR');
}

/**
 * Resolve the Coupang link for a product. Returns the exact product URL when
 * `coupangUrl` is set, otherwise a Coupang search URL built from the product
 * name (Coupang blocks automated harvesting of exact per-product URLs, so a
 * search link is the reliable fallback).
 */
export function coupangUrl(product: Product): string {
  if (product.coupangUrl) return product.coupangUrl;

  let query: string;
  if (product.category === 'oil') {
    // "LVO120, 5 Liter" -> "LEYBONOL LVO120 5L"
    query = 'LEYBONOL ' + product.nameEn.replace(/,/g, '').replace(/(\d+(?:\.\d+)?)\s*Liter/gi, '$1L');
  } else {
    // "Oil Filter (SV300B)" -> "LEYBOLD Oil Filter SV300B"
    query = 'LEYBOLD ' + product.nameEn.replace(/[()]/g, '');
  }

  return 'https://www.coupang.com/np/search?q=' + encodeURIComponent(query.trim().replace(/\s+/g, ' '));
}
