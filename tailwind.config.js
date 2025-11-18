/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    function addUtilitiesPlugin({ addUtilities }) {
      addUtilities({
        ".break-word": {
          "word-break": "break-word",
        },
        ".flex-center": {
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
        },
      });
    },
  ],
};
