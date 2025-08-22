/** @type {import('tailwindcss').Config} 仅用于v3 */
export default {
  content: ['./**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    // 外边距
    spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
      map[index] = `${index}px`
      return map
    }, {}),
  },
  plugins: [],
}
