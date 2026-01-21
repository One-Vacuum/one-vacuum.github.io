export interface Product {
  id: string;
  image: string;
  name: {
    ko: string;
    en: string;
  };
  description?: {
    ko: string;
    en: string;
  };
}

export const products: Product[] = [
  {
    id: 'product-1',
    image: '/images/products/product-1.png',
    name: {
      ko: '진공 펌프 A',
      en: 'Vacuum Pump A',
    },
    description: {
      ko: '고성능 진공 펌프',
      en: 'High-performance vacuum pump',
    },
  },
  {
    id: 'product-2',
    image: '/images/products/product-2.png',
    name: {
      ko: '진공 펌프 B',
      en: 'Vacuum Pump B',
    },
    description: {
      ko: '산업용 진공 펌프',
      en: 'Industrial vacuum pump',
    },
  },
  {
    id: 'product-3',
    image: '/images/products/product-3.png',
    name: {
      ko: '진공 게이지',
      en: 'Vacuum Gauge',
    },
    description: {
      ko: '정밀 진공 측정기',
      en: 'Precision vacuum gauge',
    },
  },
  {
    id: 'product-4',
    image: '/images/products/product-4.png',
    name: {
      ko: '진공 밸브',
      en: 'Vacuum Valve',
    },
    description: {
      ko: '고품질 진공 밸브',
      en: 'High-quality vacuum valve',
    },
  },
  {
    id: 'product-5',
    image: '/images/products/product-5.png',
    name: {
      ko: '진공 피팅',
      en: 'Vacuum Fitting',
    },
    description: {
      ko: '다양한 규격의 피팅',
      en: 'Various size fittings',
    },
  },
  {
    id: 'product-6',
    image: '/images/products/product-6.png',
    name: {
      ko: '진공 호스',
      en: 'Vacuum Hose',
    },
    description: {
      ko: '내구성 진공 호스',
      en: 'Durable vacuum hose',
    },
  },
  {
    id: 'product-7',
    image: '/images/products/product-7.png',
    name: {
      ko: '진공 챔버',
      en: 'Vacuum Chamber',
    },
    description: {
      ko: '맞춤형 진공 챔버',
      en: 'Custom vacuum chamber',
    },
  },
  {
    id: 'product-8',
    image: '/images/products/product-8.png',
    name: {
      ko: '진공 컨트롤러',
      en: 'Vacuum Controller',
    },
    description: {
      ko: '디지털 진공 컨트롤러',
      en: 'Digital vacuum controller',
    },
  },
  {
    id: 'product-9',
    image: '/images/products/product-9.png',
    name: {
      ko: '진공 필터',
      en: 'Vacuum Filter',
    },
    description: {
      ko: '고효율 진공 필터',
      en: 'High-efficiency vacuum filter',
    },
  },
  {
    id: 'product-10',
    image: '/images/products/product-10.png',
    name: {
      ko: '진공 액세서리 세트',
      en: 'Vacuum Accessory Set',
    },
    description: {
      ko: '필수 액세서리 모음',
      en: 'Essential accessory collection',
    },
  },
];

export const storeLinks = {
  store1: {
    url: 'https://example.com/store1',
    name: {
      ko: '네이버 스토어',
      en: 'Naver Store',
    },
  },
  store2: {
    url: 'https://example.com/store2',
    name: {
      ko: '쿠팡',
      en: 'Coupang',
    },
  },
};
