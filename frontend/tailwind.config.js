/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        animation: {
          'spin': 'spin 1s linear infinite',
        },
        scale: {
          '102': '1.02',
        }
      },
    },
    plugins: [],
  }