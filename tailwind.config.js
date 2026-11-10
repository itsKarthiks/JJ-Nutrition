/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // JJ Nutrition White & Sky Blue Direction
        white: '#FFFFFF',
        surface: {
          light: '#F3F9FD',     // Secondary background
          pale: '#E8F5FC',      // Light blue surface
          decorative: '#D9EFFB',// Light blue decorative
        },
        accent: {
          DEFAULT: '#42A9E5', // Primary accent: Sky blue
          sky: '#42A9E5',
          strong: '#0789D2',  // Strong accent: Strong blue
          light: '#E8F5FC',
          decorative: '#D9EFFB',
          border: '#DCE8F1',
        },
        navy: {
          DEFAULT: '#111827', // Primary typography: Near-black (#111827)
          dark: '#0B192C',
          card: '#152C48',
        },
        slate: {
          DEFAULT: '#333333', // Secondary content & descriptions (#333333)
          body: '#1A1A1A',    // Body content: Dark black (#1A1A1A)
          subtle: '#555555',  // Metadata & less prominent labels (#555555)
          light: '#555555',
        },
        border: {
          blue: '#DCE8F1',    // Borders
          DEFAULT: '#DCE8F1',
        },

        // Mapped legacy tokens for full-site consistency
        cream: {
          DEFAULT: '#FFFFFF', // Pure white dominant
          light: '#FFFFFF',
          dark: '#F3F9FD',    // Very light blue secondary
        },
        dark: {
          DEFAULT: '#111827', // Near-black replacing old navy/brown
          pure: '#0B192C',
          surface: '#12253E',
          card: '#172E4C',
        },
        muted: {
          DEFAULT: '#555555', // Metadata (#555555)
          light: '#333333',   // Secondary content (#333333)
          dark: '#555555',
        }
      },
      fontFamily: {
        serif: ['"Abhaya Libre"', 'Playfair Display', 'Georgia', 'serif'],
        script: ['Praise', '"Alex Brush"', 'cursive'],
        sans: ['"Clash Grotesk"', '"DM Sans"', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.15em',
        tightest: '-0.03em',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
