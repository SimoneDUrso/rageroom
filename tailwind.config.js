/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mappatura delle variabili
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          dark: 'var(--color-success-dark)',
        }
      },
    },
  },
  plugins: [],
}