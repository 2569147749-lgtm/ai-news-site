/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          bg: "#ffffff",
          soft: "#fff9df",
          card: "#ffffff",
          edge: "#ececec",
          dim: "#d9d9d9",
        },
        ink: {
          main: "#242424",
          sub: "#666666",
          dim: "#999999",
        },
        amber: {
          DEFAULT: "#ffd100",
          soft: "#fff1a8",
          deep: "#8a6500",
        },
        aqua: {
          DEFAULT: "#6b7280",
          soft: "#f3f4f6",
        },
        coral: {
          DEFAULT: "#9a7100",
          soft: "#fff7cc",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "JetBrains Mono",
          "SF Mono",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(31,41,55,0.04), 0 12px 32px -12px rgba(31,41,55,0.08)",
        "card-lg": "0 2px 4px rgba(31,41,55,0.05), 0 24px 48px -12px rgba(31,41,55,0.12)",
        float: "0 16px 40px -12px rgba(245,158,11,0.25)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      fontSize: {
        'terminal-xs': ['10px', '14px'],
        'terminal-sm': ['11px', '16px'],
        'terminal-base': ['13px', '20px'],
      },
    },
  },
  plugins: [],
};
