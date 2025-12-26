/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'rpr-cyan': '#00E0FF',
        'rpr-red': '#FF0000',
        'rpr-white': '#FFFFFF',
        'rpr-glass': 'rgba(255, 255, 255, 0.05)',
        rpr: {
          'black': '#000000',
          'charcoal': '#2B2F33',
          'slate': '#3A4045',
          'cyan': '#00D9FF',
          'teal': '#008B8B',
          'blue': '#0099FF',
          'red': '#FF3366',
          'green': '#00E676',
        }
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 224, 255, 0.3)',
        'red-glow': '0 0 20px rgba(255, 0, 0, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        'brand-title': '700',
        'brand-header': '600',
        'brand-emphasis': '500',
        'brand-body': '400',
      }
    },
  },
  plugins: [],
}
