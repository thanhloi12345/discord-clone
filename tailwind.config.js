/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primaryBg: "#1c1d22",
        primaryColor: "#1c1d22",
        primaryButton: "#5865f2",
        secondaryBg: "#373a43",
        grayColor: "#97979f"
      }
    },
  },
  plugins: [],
}