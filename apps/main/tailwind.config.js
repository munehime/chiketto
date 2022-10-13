/**
 * @type {import("tailwindcss").Config}
 */

module.exports = {
    presets: [
        require("@chiketto/tailwind-config")
    ],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./common/components/**/*.{ts,tsx}"
    ],
    darkMode: "media",
    theme: {
        extend: {},
    },
    plugins: [],
};
