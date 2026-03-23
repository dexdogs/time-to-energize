import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'volt': '#E8FF47',
        'grid': '#0A0F1E',
        'grid-mid': '#0D1526',
        'grid-light': '#111C35',
        'grid-border': '#1E2D50',
        'confirmed': '#22C55E',
        'inferred': '#F59E0B',
        'missing': '#6B7280',
        'active': '#E8FF47',
        'in-development': '#3B82F6',
        'speculative': '#4B5563',
      },
      fontFamily: {
        'mono': ['IBM Plex Mono', 'Courier New', 'monospace'],
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
