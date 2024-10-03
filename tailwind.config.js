/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        'pop-up': 'pop-up 0.9s ease backwards',
      },
      keyframes: {
        'pop-up': {
          '0%': { transform: 'scale(3)', opacity: '0' },
          '50%': { transform: 'scale(3.3)', opacity: '1' }, // Increased to 1.3 for a bigger pop
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
