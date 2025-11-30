/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A5C96',
          light: '#3c74a6',
          dark: '#154a78',
        },
        secondary: {
          DEFAULT: '#E6ECF2',
          light: '#eaeff4',
          dark: '#b8bdc2',
        },
        success: {
          DEFAULT: '#3BD297',
          light: '#58d9a7',
          dark: '#2fa879',
        },
        info: {
          DEFAULT: '#05B3D7',
          light: '#17a2b8',
          dark: '#0a58ca',
        },
        warning: {
          DEFAULT: '#F2C643',
          light: '#ffc107',
        },
        danger: {
          DEFAULT: '#EE4F6F',
        },
        dark: {
          DEFAULT: '#323131',
          light: '#495057',
          lighter: '#6c757d',
        },
        light: {
          DEFAULT: '#F0F0F0',
          lighter: '#F5F7F9',
        },
        heading: '#0c385f',
        body: '#333333',
        border: '#e8e8e8',
        link: '#2788ED',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Merriweather', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.824rem',
        'base': '1rem',
        'lg': '1.25rem',
        'xl': '1.5rem',
        '2xl': '1.75rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      borderRadius: {
        'sm': '0.35rem',
        DEFAULT: '0.7rem',
        'lg': '1.4rem',
        'xl': '1rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'card': '0px 7px 33px rgba(0, 0, 0, 0.05)',
        'btn': 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 1px 1px rgba(0, 0, 0, 0.075)',
      },
      spacing: {
        '18': '1.125rem',
        '35': '2.188rem',
      },
    },
  },
  plugins: [],
}
