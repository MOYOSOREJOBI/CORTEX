/**
 * Tailwind CSS configuration for CORTEX web app.
 * Extended with custom colors matching the glassmorphism design system.
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cortex: {
          blue: '#0066ff',
          'bg-start': '#1a1a4e',
          'bg-end': '#0077ff',
          dark: '#0a0a1a',
        },
      },
      fontFamily: {
        sf: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
