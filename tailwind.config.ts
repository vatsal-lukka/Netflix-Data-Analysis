import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#141414",
        card: "#1F1F1F",
        netflix: "#E50914",
        accent: "#B81D24",
        muted: "#A3A3A3",
        border: "rgba(255,255,255,0.10)"
      },
      boxShadow: {
        glow: "0 0 38px rgba(229, 9, 20, 0.24)",
        card: "0 18px 60px rgba(0,0,0,0.35)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: [animate, forms]
};

export default config;
