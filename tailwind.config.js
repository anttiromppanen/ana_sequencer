/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        userDisplayFont: ["Sixtyfour", "sans-serif"],
      },
      colors: {
        userGray9: "#222831",
        userGray8: "#31363F",
        userGray7: "#696969",
        userSidebarBg: "#525252",
        userSequenceButtonBlue: "#00bbf9",
        userSequenceButtonMint: "#04d9bc",
        userSequenceButtonYellow: "#fee440",
        userSequenceButtonPink: "#f15bb5",
        userSequenceButtonPurple: "#9b5de5",
        userSequenceButtonGreen: "#89fc00",
      },
    },
  },
  plugins: [],
};
