module.exports = {
    plugins: {
        autoprefixer: {},
        tailwindcss: './src/tailwind.config.js',
        '@fullhuman/postcss-purgecss': {
            content: ['./src/components/*.vue'],
            whitelistPatterns: [
                /^body$/,
                /^html$/,
                /^w-\d{1,3}$/,
            ],
        },
        'postcss-import': {},
        'postcss-url': {},
    },
};
