/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    colors: {
      primary: {
        base: '#3b82f6',        // 默认颜色
        faint: '#eff6ff',       // 50
        light: '#dbeafe',       // 100
        muted: '#bfdbfe',       // 200
        soft: '#93c5fd',        // 300
        moderate: '#60a5fa',    // 400
        DEFAULT: '#3b82f6',     // 500
        strong: '#2563eb',      // 600
        heavy: '#1d4ed8',       // 700
        deep: '#1e40af',        // 800
        intense: '#1e3a8a',     // 900
      },
      secondary: {
        base: '#f97316',        // 默认颜色
        faint: '#fff7ed',       // 50
        light: '#ffedd5',       // 100
        muted: '#fed7aa',       // 200
        soft: '#fdba74',        // 300
        moderate: '#fb923c',    // 400
        DEFAULT: '#f97316',     // 500
        strong: '#ea580c',      // 600
        heavy: '#c2410c',       // 700
        deep: '#9a3412',        // 800
        intense: '#7c2d12',     // 900
      },
      neutral: {
        DEFAULT: '#111827',     // 灰色 900
        faint: '#f9fafb',       // 灰色 50
        light: '#f3f4f6',       // 灰色 100
        muted: '#e5e7eb',       // 灰色 200
        soft: '#d1d5db',        // 灰色 300
        moderate: '#9ca3af',    // 灰色 400
        medium: '#6b7280',      // 灰色 500
        strong: '#4b5563',      // 灰色 600
        heavy: '#374151',       // 灰色 700
        deep: '#1f2937',        // 灰色 800
        intense: '#111827',     // 灰色 900
      },
      white: '#ffffff',
      black: '#000000',
    },
    cssVariables: {
      colorGroups: {
        primary: {
          prefix: "--primary",
          scale: {
            "": "DEFAULT",
            "faint": "faint",
            "light": "light",
            "muted": "muted",
            "soft": "soft",
            "moderate": "moderate",
            "strong": "strong",
            "heavy": "heavy",
            "deep": "deep",
            "intense": "intense",
          },
        },
        secondary: {
          prefix: "--secondary",
          scale: {
            "": "DEFAULT",
            "faint": "faint",
            "light": "light",
            "muted": "muted",
            "soft": "soft",
            "moderate": "moderate",
            "strong": "strong",
            "heavy": "heavy",
            "deep": "deep",
            "intense": "intense",
          },
        },
        neutral: {
          prefix: "--neutral",
          scale: {
            "": "DEFAULT",
            "faint": "faint",
            "light": "light",
            "muted": "muted",
            "soft": "soft",
            "moderate": "moderate",
            "medium": "medium",
            "strong": "strong",
            "heavy": "heavy",
            "deep": "deep",
            "intense": "intense",
          },
        }
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
