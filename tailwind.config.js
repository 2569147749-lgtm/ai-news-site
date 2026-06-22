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
          bg: "#fffbf2",
          soft: "#fef7e4",
          card: "#fffdf8",
          edge: "#f0e6d0",
          dim: "#e8ddb8",
        },
        ink: {
          main: "#1f2937",
          sub: "#6b7280",
          dim: "#9ca3af",
        },
        amber: {
          DEFAULT: "#f59e0b",
          soft: "#fde68a",
          deep: "#b45309",
        },
        aqua: {
          DEFAULT: "#06b6d4",
          soft: "#a5f3fc",
        },
        coral: {
          DEFAULT: "#ef4444",
          soft: "#fecaca",
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
