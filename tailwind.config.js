/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#00ffff",
        "primary-dim": "#00cccc",
        "background-light": "#f5f8f8",
        "background-dark": "#0f2323",
        "background-obsidian": "#0b1212",
        "obsidian": "#050a0a",
        "obsidian-light": "#101818",
        "obsidian-lighter": "#1b2828",
        "panel": "#142020",
        "surface-dark": "#162323",
        "accent-teal": "#395656",
        "border-dark": "#2a4040",
        "glass": "rgba(0, 255, 255, 0.05)",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "mono": ["JetBrains Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        "none": "0",
        "sm": "0.125rem",
        "DEFAULT": "0px",
        "md": "0.25rem",
        "lg": "0.5rem",
        "xl": "1rem",
        "full": "9999px",
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'ticker': 'ticker 30s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}
