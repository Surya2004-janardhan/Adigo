/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./Frontend/screens/**/*.{js,jsx,ts,tsx}",
    "./Frontend/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
};
