/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                display: ["'Barlow Condensed'", "sans-serif"],
                body: ["'IBM Plex Sans'", "sans-serif"],
                mono: ["'IBM Plex Mono'", "monospace"],
            },
            colors: {
                surface: {
                    950: "#e8e2d9",
                    900: "#f5f0e8",
                    800: "#faf7f2",
                    700: "#ede8df",
                    600: "#d6cfc4",
                },
            },
            animation: {
                "fade-in": "fadeIn 0.4s ease forwards",
                "slide-up": "slideUp 0.4s ease forwards",
            },
            keyframes: {
                fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
                slideUp: { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
            },
        },
    },
    plugins: [],
};

