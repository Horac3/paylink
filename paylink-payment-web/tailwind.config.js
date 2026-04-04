/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB',
        surface: '#FFFFFF',
        primary: '#1B4F8C',
        accent: '#2563EB',
        text: '#111827',
        muted: '#6B7280',
        success: '#16A34A',
        error: '#DC2626',
      },
    },
  },
  plugins: [],
}
