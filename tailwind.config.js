module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        'suissnord': ['Suissnord', 'sans-serif'],
        'lion': ['LionandHareLight', 'sans-serif'],
        'rajdhani-light': ['Rajdhani-Light', 'sans-serif'],
        'rajdhani-medium': ['Rajdhani-Medium', 'sans-serif'],
        'rajdhani-bold': ['Rajdhani-Bold', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}