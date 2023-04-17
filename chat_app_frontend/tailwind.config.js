/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gray : {
        900 : '#202225',
        800 : '#2f3136',
        700 : '#36393f',
        600 : '#4f545c',
        400 : '#4f545c',
        300 : '#d4d7dc',
        200 : '#ebedef',
        100 : '#f2f3f5'
      }
    },
  },
  plugins: [],
}