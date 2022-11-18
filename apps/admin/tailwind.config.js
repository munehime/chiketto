/**
 * @type {import("tailwindcss").Config}
 */

module.exports = {
    presets: [
        require("@chiketto/tailwind-config")
    ],
    content: [
        "./src/pages/**/*.{ts,tsx}",
        "./src/common/components/**/*.{ts,tsx}"
    ],
    darkMode: "media",
    theme: {
        extend: {},
    },
    plugins: [],
};
