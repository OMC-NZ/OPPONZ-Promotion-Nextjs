/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "OPPOSans-Regular": ["OPPOSans-Regular"],
        "OPPOSans-Medium": ["OPPOSans-Medium"],
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '128': '32rem',
        '144': '36rem',
      },
      transitionTimingFunction: {
        'cubic-custom': 'cubic-bezier(0.48, 0.04, 0.52, 0.96)',
      },
    },
  },
  plugins: [],
};
