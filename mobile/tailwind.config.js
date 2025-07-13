/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",       // for Expo Router pages/layouts
    "./components/**/*.{js,jsx,ts,tsx}", // for shared components
  ],
  presets: [require("nativewind/preset")], // this is required
  theme: {
    extend: {},
  },
  plugins: [],
}
