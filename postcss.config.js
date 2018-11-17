module.exports = {
    plugins: {
        autoprefixer: {},
        tailwindcss: './tailwind.config.js',
        // '@fullhuman/postcss-purgecss': {
        //     content: [
        //         './src/components/*.vue',
        //         './node_modules/vue-ads-pagination/dist/vue-ads-pagination.common.js',
        //     ],
        //     whitelistPatterns: [
        //         /^body$/,
        //         /^html$/,
        //         /^vue-ads-w-\d{1,3}$/,
        //         /^fa-sort-(.*)$/,
        //     ],
        // },
        'postcss-import': {},
        'postcss-url': {},
    },
};
