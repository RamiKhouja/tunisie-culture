import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                'arabic-title': ['Reem Kufi', 'sans-serif'],
                'arabic-body': ['Cairo', 'sans-serif'],
                'latin-title': ['Cormorant Garamond', 'serif'],
                'latin-body': ['Roboto', 'sans-serif'],
            },
        },
    },

    plugins: [forms],
};
