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
        main: '#ffffff',
        bg: '#0F0F0F',
        text: '#D3D3D3',
        successColor: '#00FF00',
        errorColor: '#FF0000'
      }
    },
  },
  plugins: [require("daisyui")],
};
export default config;
