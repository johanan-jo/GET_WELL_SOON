/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clinical Calm Palette
        primary: '#006D77',        // Deep Teal - Trust, balance
        secondary: '#83C5BE',      // Soft Sky Blue - Calm, clarity
        accent: '#FF6B6B',         // Warm Coral - Human touch
        success: '#06D6A0',        // Jade Green - Healthy
        warning: '#FFD166',        // Amber Yellow - Needs review
        danger: '#EF476F',         // Crimson Red - Critical
        critical: '#EF476F',       // Crimson Red - Abnormal
        
        // Backgrounds & Neutrals
        background: '#F8F9FA',     // Ghost White
        mist: '#E9ECEF',           // Mist Gray - Cards/Panels
        graphite: '#212529',       // Text primary
        
        // Extended palette
        teal: {
          50: '#E6F7F8',
          100: '#CCEFF1',
          200: '#99DFE3',
          300: '#66CFD5',
          400: '#33BFC7',
          500: '#006D77',           // Primary
          600: '#005760',
          700: '#004148',
          800: '#002B30',
          900: '#001518',
        },
        coral: {
          50: '#FFE8E8',
          100: '#FFD1D1',
          200: '#FFA3A3',
          300: '#FF7575',
          400: '#FF6B6B',           // Accent
          500: '#FF4747',
          600: '#E63939',
          700: '#CC2B2B',
          800: '#B31D1D',
          900: '#990F0F',
        },
        jade: {
          50: '#E6FBF5',
          100: '#CCF7EB',
          200: '#99EFD7',
          300: '#66E7C3',
          400: '#33DFAF',
          500: '#06D6A0',           // Success
          600: '#05AB80',
          700: '#048060',
          800: '#035540',
          900: '#022A20',
        }
      },
      boxShadow: {
        'clinical': '0 2px 8px rgba(0, 109, 119, 0.08)',
        'card': '0 4px 12px rgba(0, 109, 119, 0.1)',
        'elevated': '0 8px 24px rgba(0, 109, 119, 0.15)',
      }
    },
  },
  plugins: [],
}
