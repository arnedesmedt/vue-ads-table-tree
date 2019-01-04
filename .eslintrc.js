module.exports = {
    root: true,

    env: {
        node: true,
    },

    extends: [
        'plugin:vue/essential',
        '@vue/standard',
        'eslint-config-ads',
        'eslint-config-ads/vue',
    ],

    parserOptions: {
        parser: 'babel-eslint',
    },
};
