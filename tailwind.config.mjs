/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  // Only apply `hover:` styles on devices that actually support hover, so hover
  // states (card lift, button colors) don't stick after a tap on touch screens.
  future: { hoverOnlyWhenSupported: true },
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Brand palette taken from the wordmark: near-black ink, one blue accent
      // (the dot in the "O"), warm-neutral paper surfaces.
      colors: {
        ink: {
          DEFAULT: '#111216', // text, primary buttons, logo
          soft: '#4B4D55', // secondary text (8.4:1 on white, 6.2:1 on paper-dim)
          mute: '#6B6D75', // tertiary text (4.6:1 on paper; too light for paper-dim)
        },
        paper: {
          DEFAULT: '#F3F3F1', // hero panel, tiles, image wells
          deep: '#E9E9E5', // hover on paper
          // Product image wells: photos (pure white backgrounds, see
          // scripts/normalize-product-images.py) are multiplied onto them.
          well: '#F0F0ED',
          dim: '#DCDDD9', // image wells in dark mode
        },
        line: {
          DEFAULT: '#E4E4E0', // dividers
          strong: '#7A7C84', // search and sort borders (3.7:1+ on white and paper)
        },
        // Store brand dots on the Naver / Coupang buttons
        naver: '#03C75A',
        coupang: '#346AFF',
        accent: {
          DEFAULT: '#1F5BFF', // logo dot, active states (5.3:1 on white)
          light: '#7C9DFF', // accent on dark backgrounds
        },
        night: {
          DEFAULT: '#0E0F11', // dark-mode page
          raised: '#17181B',
          high: '#202125',
          line: '#2A2C31',
          strong: '#63666E', // the same in dark mode
        },
        snow: {
          DEFAULT: '#F2F2F0', // dark-mode text
          soft: '#B4B6BD',
          mute: '#8E9098',
        },
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
        // Wordmark face, used only for small uppercase Latin labels.
        display: ['Archivo', 'Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
