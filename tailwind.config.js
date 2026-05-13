module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        primary: '#1DB849',
        'primary-dark': '#168A3E',
        'primary-light': '#2dd66f',
        secondary: '#1f2937',
        'secondary-dark': '#111827',
        accent: '#FF6B6B',
        'accent-light': '#FF8C8C',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'info': '#3B82F6',
        'dark-bg': '#071425',
        'dark-card': '#0f2139',
        'border-light': 'rgba(255, 255, 255, 0.1)',
        'border-border': 'rgba(255, 255, 255, 0.14)',
      },
      backgroundColor: {
        'gradient-dark': 'linear-gradient(180deg, #071425 0%, #0a1a2d 55%, #0f2139 100%)',
        'glass': 'rgba(15, 33, 57, 0.8)',
        'card': 'rgba(15, 33, 57, 0.9)',
      },
      borderColor: {
        'default': 'rgba(255, 255, 255, 0.14)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
        'scale-out': 'scaleOut 0.3s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(52, 131, 250, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(52, 131, 250, 0.6)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'xl': '0 20px 40px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 30px rgba(52, 131, 250, 0.4)',
        'glow-green': '0 0 30px rgba(29, 184, 73, 0.3)',
        'glow-accent': '0 0 30px rgba(255, 107, 107, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};
