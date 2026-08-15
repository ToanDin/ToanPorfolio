/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — giá trị thật nằm trong app/globals.css, đổi theo [data-theme]
        night: 'rgb(var(--c-bg) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        ink: 'rgb(var(--c-text) / <alpha-value>)',
        'ink-soft': 'var(--c-text-soft)',
        'ink-mute': 'var(--c-text-mute)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        accentp: 'rgb(var(--c-accentp) / <alpha-value>)',
        accent2: 'rgb(var(--c-accent2) / <alpha-value>)',
        surface: 'var(--c-surface)',
        'surface-2': 'var(--c-surface-2)',
        line: 'var(--c-border)',
        'line-strong': 'var(--c-border-strong)',
      },
      fontFamily: {
        // Font nạp bằng next/font trong app/layout.jsx (biến --font-inter / --font-sora)
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
