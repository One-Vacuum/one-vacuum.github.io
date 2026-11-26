# One Vacuum (원베큠)

Astro + Tailwind CSS로 제작된 회사 브로슈어 웹사이트입니다.

For English: [README.en.md](README.en.md)

---

## 로컬 개발

### 사전 요구사항

- Node.js 18+ 설치
- npm 또는 yarn

### 로컬 실행 방법

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 시작**
   ```bash
   npm run dev
   ```

3. **브라우저에서 열기**
   - http://localhost:4321
   - 단일 페이지이며, 우측 상단 KO/EN 토글로 언어 전환

4. **프로덕션 빌드 테스트** (병합 전 권장)
   ```bash
   npm run build
   npm run preview
   ```

### 병합 전 체크리스트

- `npm run dev` 오류 없이 실행
- 페이지 정상 로드 (http://localhost:4321)
- 언어 전환 버튼 동작 (KO는 한국어, EN은 영어)
- 모든 제품 이미지 표시
- 제품 카드의 네이버/쿠팡 구매 버튼 동작
- 제품 검색 및 정렬 동작
- 모바일 반응형 레이아웃 동작
- `npm run build` 오류 없이 완료
- `npm test` 통과
- `npm run check` 통과 (타입 검사, `.tool-versions`의 Node 22 필요)
- 두 사이트 공통 파일(언어 전환·CI 등)을 고쳤다면 `scripts/check-shared.sh ../top-vacuum.github.io` 통과 (두 사이트가 같은 파일을 씀)

## 이미지 추가

> **이미지 크기 최적화**: 제품 이미지는 가능한 작은 파일 크기를 사용해주세요. JPG 형식 권장 (PNG 대비 파일 크기가 작음). 큰 이미지는 페이지 로딩 속도와 GitHub 저장소 용량에 영향을 줍니다.

> **제품 사진 크기 맞추기**: 제품 사진을 추가하거나 바꾼 뒤에는 `scripts/normalize-product-images.py <파일명>`을 실행하세요 (사용법은 파일 상단 참고). 흰 정사각형 배경에 제품을 가운데, 화면의 84% 크기로 맞춰서 모든 카드에서 제품 크기가 같아집니다.

> **필터 사진 배경 지우기**: 필터(오일 필터·진공 필터) 사진을 추가하거나 바꿨다면, 크기 맞추기 다음에 `scripts/build-product-cutouts.py <파일명>`도 실행하세요 (사용법은 파일 상단 참고. 처음 실행할 때 약 1GB 모델을 내려받습니다). 흰 필터는 회색 사진 배경에 묻혀 잘 안 보이기 때문에, 배경을 지운 사진(`public/products/cutouts/`)을 대신 보여줍니다. 실행하지 않아도 원래 사진이 그대로 나옵니다.

### 회사 로고

- 헤더/푸터 로고: `src/components/Logo.astro` (인라인 SVG — 글자색을 따라가고, O 안의 점만 브랜드 블루)
- 로고 파일: `public/images/logo.svg`
- 로고를 다시 만들 때: `scripts/build-wordmark.py` (사용법은 파일 상단 참고) — 경로를 직접 수정하지 마세요
- 링크 공유 미리보기 이미지 (1200×630): `public/images/logo.png`
- 첫 화면 제품 사진(배경 투명): `public/images/hero/` — 해당 제품 사진을 바꾸면 `scripts/build-hero-cutouts.py`로 다시 만드세요 (사용법은 파일 상단 참고)

### 파비콘

파비콘 파일 위치:
```
public/images/favicon/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
└── android-chrome-512x512.png
```

## 제품 관리

모든 제품 파일은 `public/products/` 폴더에 있습니다.

```
public/products/
├── products.json      ← 제품 데이터 (품번, 이름, 카테고리, 가격)
├── cutouts/           ← 필터 사진의 배경 지운 버전 (자동 생성, 직접 수정 X)
└── images/            ← 제품 이미지
    ├── product-1.png
    ├── product-2.png
    └── ...
```

### 새 제품 추가:

1. **제품 이미지**를 `public/products/images/` 폴더에 추가

2. **`public/products/products.json`** 파일에 새 항목 추가:
   ```json
   {
     "partNumber": "ABC123",
     "image": "이미지파일.jpg",
     "nameKo": "제품 이름",
     "nameEn": "Product Name",
     "descriptionKo": "제품 설명 (선택)",
     "descriptionEn": "Product description (optional)",
     "category": "oil",
     "price": 50000,
     "bestSeller": false,
     "naverUrl": "https://smartstore.naver.com/onevacuum/products/123",
     "coupangUrl": "https://www.coupang.com/vp/products/456"
   }
   ```
   - `partNumber`: 제품 품번 (필수)
   - `category`: `oil` (오일), `oil-filter` (오일 필터), `vacuum-filter` (진공 필터) 중 택 1
   - `price`: 원화 정수 (예: 50000 → ₩50,000으로 표시)
   - `bestSeller`: `true`로 설정하면 BEST 배지 표시 및 기본 정렬에서 상단 노출
   - `naverUrl` (선택): 네이버 스토어 상품 페이지 링크. 제품 카드의 "네이버" 버튼(초록 점)에 연결됩니다. 없으면 버튼이 숨겨집니다.
   - `coupangUrl` (선택): 쿠팡 상품 페이지 링크. 생략하면 제품명으로 만든 쿠팡 **검색 링크**가 자동 사용됩니다 (쿠팡은 상품 URL 자동 수집이 차단되어 검색 링크를 기본값으로 사용)

3. **커밋 및 푸시** - 웹사이트가 자동으로 업데이트됩니다!

### 제품 삭제:

1. `public/products/images/`에서 이미지 삭제
2. `products.json`에서 해당 항목 삭제

### 제품이 없는 경우:

`products.json`을 빈 배열 `[]`로 설정하면 "제품 준비 중입니다..." 메시지가 표시됩니다.

## 배포

`main` 브랜치에 푸시하면 테스트(`npm test`)와 빌드 후 GitHub Pages로 자동 배포됩니다. PR을 열면 같은 테스트와 빌드가 CI(`.github/workflows/ci.yml`)로 실행됩니다.

### GitHub Pages 최초 설정

1. 저장소 **Settings** > **Pages** 이동
2. "Build and deployment"에서 **GitHub Actions** 선택
3. `main` 브랜치에 푸시하여 배포 시작
4. 사이트 주소: https://onevacuum.kr

## SEO (검색 노출)

빌드 시 검색엔진 최적화 자산이 자동 생성됩니다.

- **`sitemap.xml`** — `@astrojs/sitemap`이 빌드마다 `sitemap-index.xml`을 자동 생성
- **`robots.txt`** — `public/robots.txt`에 위치하며 사이트맵 위치를 안내
- **메타 태그** — `BaseLayout.astro`에 canonical, Open Graph(카카오톡·페이스북 공유 미리보기), Twitter 카드, JSON-LD 구조화 데이터 포함

### 검색엔진에 사이트 등록 (수동, 최초 1회)

코드 자산만으로는 색인이 빨리 되지 않습니다. 도메인 소유자가 직접 등록해야 합니다.

1. [Google Search Console](https://search.google.com/search-console)에서 **도메인** 속성으로 `onevacuum.kr` 추가 후 DNS TXT 레코드로 소유권 인증
2. **URL 검사** > `https://onevacuum.kr/` > **색인 생성 요청**
3. **Sitemaps**에서 `https://onevacuum.kr/sitemap-index.xml` 제출
4. [네이버 서치어드바이저](https://searchadvisor.naver.com/) > **웹마스터 도구**에 `onevacuum.kr` 등록 (네이버는 DNS 인증 미지원 — `BaseLayout.astro` `<head>`의 `naver-site-verification` 메타태그로 소유권 확인). 배포 후 소유확인 → **요청 > 사이트맵 제출**에 `https://onevacuum.kr/sitemap-index.xml` 제출. 이 메타태그를 지우면 소유권 인증이 풀립니다.
