import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.5rem', lg: '2rem', '2xl': '3rem' },
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        // ===== Aetherion brand palette =====
        ink: {
          DEFAULT: '#050505',
          900: '#0A0A0A',
          800: '#101010',
          700: '#161616',
          600: '#1B1B1B',
          500: '#242424',
          400: '#2F2F2F',
          300: '#3D3D3D',
          200: '#525252',
          100: '#6B6B6B',
        },
        gold: {
          50: '#FBF7EE',
          100: '#F2E7C9',
          200: '#E5D29D',
          300: '#D5BB7E',
          400: '#C8A96B',
          500: '#A68A4F',
          600: '#86703D',
          700: '#66552E',
          800: '#473B20',
          900: '#2A2313',
        },
        ivory: { DEFAULT: '#F5F1E8', 50: '#FBFAF5', 100: '#F5F1E8', 200: '#EAE3CF' },
        ruby:    { DEFAULT: '#7A1E2C', light: '#A23244', dark: '#591421' },
        emerald: { DEFAULT: '#0F5C4D', light: '#1A8770', dark: '#0A3F35' },
        navy:    { DEFAULT: '#0F172A', light: '#1E293B', dark: '#080D1A' },
        silver:  { DEFAULT: '#A8A8A8' },

        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: { '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.04em' }] },
      letterSpacing: { tightest: '-0.04em' },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        shimmer:    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'fade-up':  { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'glow-pulse': { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        aurora: { '0%, 100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(-3%, 3%)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        shimmer:    'shimmer 3s linear infinite',
        'fade-up':  'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        aurora:     'aurora 20s ease-in-out infinite',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F2E7C9 0%, #C8A96B 50%, #86703D 100%)',
        'ink-gradient':  'linear-gradient(180deg, #050505 0%, #101010 100%)',
        'holo': 'conic-gradient(from 180deg at 50% 50%, #C8A96B, #7A1E2C, #0F5C4D, #0F172A, #C8A96B)',
      },
      boxShadow: {
        'gold-glow':   '0 0 40px -10px rgba(200, 169, 107, 0.45)',
        'inner-light': 'inset 0 1px 0 0 rgba(245, 241, 232, 0.06)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
