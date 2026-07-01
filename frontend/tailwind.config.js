/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // ============================================
        // PRIMARY: Dark Olive Green (#4F5844)
        // ============================================
        primary: {
          DEFAULT: '#4F5844',
          foreground: '#F8F6F2',
          light: '#8C9577',
          medium: '#5E6653',
          dark: '#3E4636',
          muted: '#65705D',
          subtle: '#E8EDDF',
          50: '#F4F7EF',
          100: '#E8EDDF',
          200: '#D1DBC0',
          300: '#B8C99F',
          400: '#8C9577',
          500: '#5E6653',
          600: '#4F5844',
          700: '#3E4636',
          800: '#2E3428',
          900: '#1E221A',
        },

        // ============================================
        // SECONDARY: Warm Sand / Light Beige (#D8CEC6)
        // ============================================
        secondary: {
          DEFAULT: '#D8CEC6',
          foreground: '#2B2F2A',
          light: '#F3EFEA',
          dark: '#C5BDB2',
          muted: '#CBBEAF',
          50: '#FBF8F5',
          100: '#F3EFEA',
          200: '#D8CEC6',
          300: '#CFC4B8',
          400: '#C5BDB2',
          500: '#B8AEA2',
          600: '#A89C8E',
          700: '#988A7A',
          800: '#887866',
          900: '#786652',
        },

        // ============================================
        // ACCENT: Deep Maroon (#7A2E2A)
        // ============================================
        accent: {
          DEFAULT: '#7A2E2A',
          foreground: '#F8F6F2',
          light: '#A14444',
          dark: '#5C2220',
          muted: '#8D3A33',
          50: '#F5EDEC',
          100: '#E8D4D2',
          200: '#D1A8A5',
          300: '#B87D78',
          400: '#A14444',
          500: '#8D3A33',
          600: '#7A2E2A',
          700: '#5C2220',
          800: '#3E1615',
          900: '#1F0B0A',
        },

        // ============================================
        // OLIVE VARIANTS
        // ============================================
        olive: {
          DEFAULT: '#4F5844',
          light: '#8C9577',
          dark: '#3E4636',
          muted: '#65705D',
          surface: '#596351',
          gradient: '#5E6653',
        },

        // ============================================
        // SAND VARIANTS
        // ============================================
        sand: {
          DEFAULT: '#D8CEC6',
          light: '#F3EFEA',
          dark: '#C5BDB2',
          muted: '#CBBEAF',
          warm: '#F1E8DD',
        },

        // ============================================
        // NEUTRAL COLORS
        // ============================================
        neutral: {
          50: '#F8F6F2',
          100: '#F0EDE8',
          200: '#DDD6CC',
          300: '#C6C0B7',
          400: '#A8A8A8',
          500: '#8C8C8C',
          600: '#6B6B6B',
          700: '#50584C',
          800: '#333333',
          900: '#2B2F2A',
          950: '#1E1E1E',
        },

        // ============================================
        // SURFACE COLORS
        // ============================================
        surface: {
          light: '#F5F2EC',
          dark: '#596351',
          card: '#F5F2EC',
          'card-dark': '#4A5446',
        },

        // ============================================
        // TEXT COLORS (With Perfect Contrast)
        // ============================================
        text: {
          // Light Background (Sand)
          primary: '#2B2F2A',
          secondary: '#50584C',
          tertiary: '#7D8478',
          disabled: '#A6ADA3',
          // Dark Background (Olive)
          dark: {
            primary: '#F8F6F2',
            secondary: '#E4DDD3',
            tertiary: '#C6C0B7',
            disabled: '#8E938B',
          },
        },

        // ============================================
        // SEMANTIC / STATUS COLORS
        // ============================================
        success: {
          DEFAULT: '#5F7A5A',
          foreground: '#F8F6F2',
          light: '#7C846B',
          dark: '#4A5F45',
          muted: '#8CA882',
        },

        warning: {
          DEFAULT: '#B08D57',
          foreground: '#F8F6F2',
          light: '#CBB68B',
          dark: '#8A6D40',
          muted: '#D4C4A0',
        },

        error: {
          DEFAULT: '#8D3A33',
          foreground: '#F8F6F2',
          light: '#A14444',
          dark: '#5C2220',
          muted: '#B87D78',
        },

        info: {
          DEFAULT: '#58738A',
          foreground: '#F8F6F2',
          light: '#7A93A8',
          dark: '#40576A',
          muted: '#9AB0C2',
        },

        // ============================================
        // SUPPORTING COLORS
        // ============================================
        terracotta: {
          DEFAULT: '#B65F4B',
          foreground: '#F8F6F2',
          light: '#C97A6A',
          dark: '#8A4738',
        },

        clay: {
          DEFAULT: '#A6775A',
          foreground: '#F8F6F2',
          light: '#B8927A',
          dark: '#7D5A43',
        },

        teal: {
          DEFAULT: '#4F6F6F',
          foreground: '#F8F6F2',
          light: '#6B8A8A',
          dark: '#3A5555',
        },

        dusty: {
          blue: '#58738A',
          DEFAULT: '#58738A',
          foreground: '#F8F6F2',
        },

        // ============================================
        // BORDER COLORS
        // ============================================
        border: {
          DEFAULT: '#C5BDB2',
          light: '#C5BDB2',
          dark: '#65705D',
        },

        // ============================================
        // MUTED COLORS
        // ============================================
        muted: {
          DEFAULT: '#D8CEC6',
          foreground: '#7D8478',
        },

        // ============================================
        // CARD COLORS
        // ============================================
        card: {
          DEFAULT: '#F5F2EC',
          foreground: '#2B2F2A',
          dark: '#596351',
          'dark-foreground': '#F8F6F2',
        },

        // ============================================
        // POPOVER
        // ============================================
        popover: {
          DEFAULT: '#F5F2EC',
          foreground: '#2B2F2A',
        },

        // ============================================
        // DESTRUCTIVE (Alias for Error)
        // ============================================
        destructive: {
          DEFAULT: '#8D3A33',
          foreground: '#F8F6F2',
        },
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ============================================
      // FONT FAMILY
      // ============================================
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },

      // ============================================
      // SCREENS
      // ============================================
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

      // ============================================
      // ANIMATIONS
      // ============================================
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'hero': 'heroGradient 10s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(79, 88, 68, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(79, 88, 68, 0.4)' },
        },
        heroGradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },

      // ============================================
      // GRADIENTS
      // ============================================
      backgroundImage: {
        // Hero: #D8CEC6 → #CFC4B8 → #8C9577 → #4F5844
        'gradient-hero': 'linear-gradient(135deg, #D8CEC6 0%, #CFC4B8 35%, #8C9577 70%, #4F5844 100%)',
        // Olive: #5E6653 → #4F5844 → #3E4636
        'gradient-olive': 'linear-gradient(135deg, #5E6653, #4F5844, #3E4636)',
        // Warm: #F1E8DD → #D8CEC6 → #CBBEAF
        'gradient-warm': 'linear-gradient(135deg, #F1E8DD, #D8CEC6, #CBBEAF)',
        // Dark: #394131 → #4F5844 → #5E6653
        'gradient-dark': 'linear-gradient(135deg, #394131, #4F5844, #5E6653)',
        // Olive to Maroon
        'gradient-olive-maroon': 'linear-gradient(135deg, #4F5844, #7A2E2A)',
        // Maroon Accent
        'gradient-maroon': 'linear-gradient(135deg, #7A2E2E, #A14444)',
      },

      // ============================================
      // SHADOWS (Olive Tinted)
      // ============================================
      boxShadow: {
        // Soft: rgba(79,88,68,0.12)
        'soft': '0 4px 14px 0 rgba(79, 88, 68, 0.12)',
        'soft-lg': '0 8px 30px 0 rgba(79, 88, 68, 0.12)',
        // Medium: rgba(79,88,68,0.22)
        'medium': '0 4px 14px 0 rgba(79, 88, 68, 0.22)',
        'medium-lg': '0 8px 30px 0 rgba(79, 88, 68, 0.22)',
        // Large: rgba(79,88,68,0.35)
        'large': '0 4px 14px 0 rgba(79, 88, 68, 0.35)',
        'large-lg': '0 8px 30px 0 rgba(79, 88, 68, 0.35)',
        // Primary Button
        'primary': '0 4px 14px 0 rgba(79, 88, 68, 0.35)',
        'primary-lg': '0 8px 30px 0 rgba(79, 88, 68, 0.35)',
        // Card
        'card': '0 4px 14px 0 rgba(79, 88, 68, 0.12)',
        'card-hover': '0 8px 30px 0 rgba(79, 88, 68, 0.22)',
        // Navigation
        'nav': '0 4px 20px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};