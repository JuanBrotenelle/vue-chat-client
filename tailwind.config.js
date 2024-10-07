/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      colors: {
        'text': '#1f1f1f',
        'textinvert': '#d1d1d1',
        'textlink': '#2e4c63',
        'components': '#5388b0',
        'activebutton': '#49789c',
      },
      gridTemplateColumns: {
        'chat': '500px 1fr',
      }
    },
  },
}

