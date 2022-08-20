module.exports = {
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          700: "#8B8B8B",
          900: "#242424",
        },
        green: {
          300: "#a3b18a",
          400: "#588157",
          600: "#3a5a40",
          800: "#344e41",
        },
        sand: {
          300: "#dad7cd",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
