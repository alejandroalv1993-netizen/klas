import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        carbon: "#0D0D0D",
        fog: "#F5F5F5",
        indigo: "#4F46E5",
        mint: "#22C55E",
        energy: "#F97316"
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(13, 13, 13, 0.08)",
        lift: "0 26px 80px rgba(13, 13, 13, 0.14)"
      },
      borderRadius: {
        "klas": "8px"
      }
    }
  },
  plugins: []
};

export default config;
