/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Nền tối chủ đạo + màu nhấn — đổi tại đây để đổi "brand" toàn trang
        night: '#0a0a14',
        panel: '#12121f',
        accent: '#7c6cff',
        accent2: '#00d4ff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
