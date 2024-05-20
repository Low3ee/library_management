/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["nord"],
  },
  plugins: [require("flowbite/plugin"), require("daisyui")],
};
