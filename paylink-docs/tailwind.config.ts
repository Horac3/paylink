import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CSS variables defined in index.css — supports opacity modifiers (bg-bg/50)
        bg:               'rgb(var(--color-bg) / <alpha-value>)',
        surface:          'rgb(var(--color-surface) / <alpha-value>)',
        border:           'rgb(var(--color-border) / <alpha-value>)',
        primary:          'rgb(var(--color-primary) / <alpha-value>)',
        accent:           'rgb(var(--color-accent) / <alpha-value>)',
        success:          'rgb(var(--color-success) / <alpha-value>)',
        warning:          'rgb(var(--color-warning) / <alpha-value>)',
        error:            'rgb(var(--color-error) / <alpha-value>)',
        'text-primary':   'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'code-bg':        'rgb(var(--color-code-bg) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        code: '13px',
      },
    },
  },
  plugins: [],
};

export default config;
