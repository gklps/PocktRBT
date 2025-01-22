/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        yellow: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
    },
  },
  safelist: [
    {
      pattern: /bg-(yellow|blue|green|purple|red)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /text-(yellow|blue|green|purple|red)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /border-(yellow|blue|green|purple|red)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /ring-(yellow|blue|green|purple|red)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /hover:bg-(yellow|blue|green|purple|red)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /hover:text-(yellow|blue|green|purple|red)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /hover:border-(yellow|blue|green|purple|red)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /focus:ring-(yellow|blue|green|purple|red)-(50|100|200|300|400|500|600|700|800|900)/,
    }
  ],
  plugins: [],
};