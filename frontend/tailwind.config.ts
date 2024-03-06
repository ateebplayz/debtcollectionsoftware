import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main: '#cebebe',
        bg: '#ece2d0',
        tertiary: '#d5b9b2',
        text: '#D3D3D3',
        successColor: '#00FF00',
        errorColor: '#FF0000'
      }
    },
  },
  plugins: [require("daisyui")],
};
export default config;
