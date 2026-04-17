/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        arena: {
          950: '#020617',
          900: '#0f172a',
          800: '#172554',
        },
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(125, 211, 252, 0.12), 0 22px 54px rgba(8, 47, 73, 0.32)',
        ember: '0 0 0 1px rgba(249, 115, 22, 0.2), 0 20px 44px rgba(154, 52, 18, 0.24)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at 18% 18%, rgba(56,189,248,0.18), transparent 26%), radial-gradient(circle at 82% 14%, rgba(249,115,22,0.14), transparent 22%), radial-gradient(circle at 50% 78%, rgba(15,23,42,0.22), transparent 26%)',
      },
    },
  },
  plugins: [],
};
