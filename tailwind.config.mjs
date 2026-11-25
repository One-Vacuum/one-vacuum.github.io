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
          soft: '#4B4D55', // secondary text (8.5:1 on white)
          mute: '#6B6D75', // tertiary text (4.8:1 on paper)
        },
        paper: {
          DEFAULT: '#F3F3F1', // hero panel, tiles, image wells
          deep: '#E9E9E5', // hover on paper
          // Product image wells. Photos blend in with mix-blend-darken, so any
          // photo background lighter than the well disappears; several photos
          // have off-white (#EBEBEB–#F7F7F7) backgrounds, hence a well this tone.
          well: '#F0F0ED',
          dim: '#DCDDD9', // image wells in dark mode
        },
        line: '#E4E4E0',
        accent: {
          DEFAULT: '#1F5BFF', // logo dot, active states (5.3:1 on white)
          light: '#7C9DFF', // accent on dark backgrounds
        },
        night: {
          DEFAULT: '#0E0F11', // dark-mode page
          raised: '#17181B',
          high: '#202125',
          line: '#2A2C31',
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
