export const languages = {
  ko: '한국어',
  en: 'English',
};

export const defaultLang = 'ko';

export const ui = {
  ko: {
    // Site
    'site.title': 'One Vacuum | 원베큠',
    'site.description': '고품질 진공 장비 및 부품 전문 기업',

    // Navigation
    'nav.home': '홈',
    'nav.products': '제품',
    'nav.contact': '연락처',
    'nav.buy': '구매처',

    // Hero
    'hero.title': 'One Vacuum',
    'hero.subtitle': '원베큠',
    'hero.description': '고품질 진공 장비 및 부품을 제공하는 전문 기업입니다. 다양한 산업 분야에 최적화된 진공 솔루션을 제공합니다.',

    // Products
    'products.title': '제품 소개',
    'products.subtitle': '다양한 진공 장비 및 부품을 만나보세요',

    // Where to Buy
    'buy.title': '구매처',
    'buy.subtitle': '아래 온라인 스토어에서 제품을 구매하실 수 있습니다',
    'buy.store1': '스토어 1',
    'buy.store2': '스토어 2',

    // Contact
    'contact.title': '연락처',
    'contact.phone': '전화',
    'contact.email': '이메일',
    'contact.address': '주소',

    // Footer
    'footer.copyright': '© 2024 One Vacuum. All rights reserved.',
  },
  en: {
    // Site
    'site.title': 'One Vacuum',
    'site.description': 'Professional vacuum equipment and parts supplier',

    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.contact': 'Contact',
    'nav.buy': 'Where to Buy',

    // Hero
    'hero.title': 'One Vacuum',
    'hero.subtitle': '',
    'hero.description': 'We are a professional company providing high-quality vacuum equipment and parts. We offer optimized vacuum solutions for various industries.',

    // Products
    'products.title': 'Our Products',
    'products.subtitle': 'Explore our range of vacuum equipment and parts',

    // Where to Buy
    'buy.title': 'Where to Buy',
    'buy.subtitle': 'Purchase our products at the online stores below',
    'buy.store1': 'Store 1',
    'buy.store2': 'Store 2',

    // Contact
    'contact.title': 'Contact Us',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.address': 'Address',

    // Footer
    'footer.copyright': '© 2024 One Vacuum. All rights reserved.',
  },
} as const;

export type UIKeys = keyof typeof ui.ko;
