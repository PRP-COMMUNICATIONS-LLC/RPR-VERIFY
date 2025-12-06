/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        rpr: {
          // Official RPR Brand Kit Colors
          'black': '#000000',           // Pure Black (Dark Background)
          'charcoal': '#2B2F33',        // Deep Charcoal (Primary Background)
          'slate': '#3A4045',           // Slate Gray (Cards/Borders)
          'cyan': '#00D9FF',            // Brand Cyan (Primary Accent)
          'teal': '#008B8B',            // Teal (Secondary Accent)
          'blue': '#0099FF',            // Electric Blue (Escalation)
          'red': '#FF3366',             // Red (Alert/Danger)
          'green': '#00E676',           // Green (Success)
          // Legacy aliases for backwards compatibility
          900: '#000000',
          800: '#2B2F33',
          700: '#3A4045',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        'brand-title': '700',      // Main page titles
        'brand-header': '600',     // Section headers
        'brand-emphasis': '500',   // UI emphasis
        'brand-body': '400',       // Body text
      }
    },
  },
  plugins: [],
};
