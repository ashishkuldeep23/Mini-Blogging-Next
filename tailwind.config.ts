import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Enables toggling dark mode using the "dark" class
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {

    screens: {
      xs: '300px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },

    extend: {

    },
  },
  plugins: [
    require("@headlessui/react"),
  ],
};
export default config;
