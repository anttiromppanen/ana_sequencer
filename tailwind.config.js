/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {},
      colors: {
        userBgColor: "#414141",
        userSidebarBg: "#525252",
        userSequenceButtonBlue: "#00bbf9",
        userSequenceButtonMint: "#00f5d4",
        userSequenceButtonYellow: "#fee440",
        userSequenceButtonPink: "#f15bb5",
        userSequenceButtonPurple: "#9b5de5",
        userSequenceButtonGreen: "#89fc00",
      },
    },
  },
  plugins: [],
};
