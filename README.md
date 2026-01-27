# One Vacuum (원베큠)

Astro + Tailwind CSS로 제작된 회사 브로슈어 웹사이트입니다.

For English: [README_EN.md](README_EN.md)

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
   - 한국어: http://localhost:4321/ko/
   - 영어: http://localhost:4321/en/

4. **프로덕션 빌드 테스트** (병합 전 권장)
   ```bash
   npm run build
   npm run preview
   ```

### 병합 전 체크리스트

- `npm run dev` 오류 없이 실행
- 한국어 페이지 (`/ko/`) 정상 로드
- 영어 페이지 (`/en/`) 정상 로드
- 언어 전환 버튼 동작
- 모든 제품 이미지 표시
- 외부 스토어 링크 동작
- 모바일 반응형 레이아웃 동작
- `npm run build` 오류 없이 완료

## 이미지 추가

### 회사 로고

로고 파일 위치:
```
public/images/logo.png
```
- 권장 크기: 200x80 픽셀 (또는 비슷한 비율)
- 지원 형식: PNG, JPG, SVG

## 제품 관리

모든 제품 파일은 `public/products/` 폴더에 있습니다.

```
public/products/
├── products.json      ← 제품 데이터 (이름, 설명)
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
     "image": "이미지파일.png",
     "nameKo": "제품 이름",
     "nameEn": "Product Name",
     "descriptionKo": "제품 설명",
     "descriptionEn": "Product description",
     "order": 5
   }
   ```

3. **커밋 및 푸시** - 웹사이트가 자동으로 업데이트됩니다!

### 제품 삭제:

1. `public/products/images/`에서 이미지 삭제
2. `products.json`에서 해당 항목 삭제

### 제품 순서 변경:

`order` 숫자 변경 (낮을수록 먼저 표시)

### 제품이 없는 경우:

`products.json`을 빈 배열 `[]`로 설정하면 "제품 준비 중입니다..." 메시지가 표시됩니다.

## 배포

`main` 브랜치에 푸시하면 GitHub Pages로 자동 배포됩니다.

### GitHub Pages 최초 설정

1. 저장소 **Settings** > **Pages** 이동
2. "Build and deployment"에서 **GitHub Actions** 선택
3. `main` 브랜치에 푸시하여 배포 시작
4. 사이트 주소: https://onevacuum.kr
