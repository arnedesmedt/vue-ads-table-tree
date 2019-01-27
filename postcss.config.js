module.exports = {
    plugins: {
        autoprefixer: {},
        tailwindcss: './tailwind.config.js',
        '@fullhuman/postcss-purgecss': {
            content: [
                './src/components/*.vue',
                './node_modules/vue-ads-pagination/dist/vue-ads-pagination.common.js',
                './node_modules/vue-ads-form-builder/dist/vue-ads-form-builder.common.js',
            ],
            whitelistPatterns: [
                /^body$/,
                /^html$/,
                /^fa-sort-(.*)$/,
            ],
        },
        'postcss-import': {},
        'postcss-url': {},
    },
};
