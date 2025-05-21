const colors = require('./constants/colors')
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./ui/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: `hsl(${colors.border})`,
        input: `hsl(${colors.input})`,
        ring: `hsl(${colors.ring})`,
        background: `hsl(${colors.background})`,
        foreground: `hsl(${colors.foreground})`,
        primary: {
          DEFAULT: `hsl(${colors.primary.DEFAULT})`,
          foreground: `hsl(${colors.primary.foreground})`,
        },
        secondary: {
          DEFAULT: `hsl(${colors.secondary.DEFAULT})`,
          foreground: `hsl(${colors.secondary.foreground})`,
        },
        destructive: {
          DEFAULT: `hsl(${colors.destructive.DEFAULT})`,
          foreground: `hsl(${colors.destructive.foreground})`,
        },
        muted: {
          DEFAULT: `hsl(${colors.muted.DEFAULT})`,
          foreground: `hsl(${colors.muted.foreground})`,
        },
        accent: {
          DEFAULT: `hsl(${colors.accent.DEFAULT})`,
          foreground: `hsl(${colors.accent.foreground})`,
        },
        popover: {
          DEFAULT: `hsl(${colors.popover.DEFAULT})`,
          foreground: `hsl(${colors.popover.foreground})`,
        },
        card: {
          DEFAULT: `hsl(${colors.card.DEFAULT})`,
          foreground: `hsl(${colors.card.foreground})`,
        },
      },
    },
  },
  plugins: [],
};
