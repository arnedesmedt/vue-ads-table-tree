module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/recommended',
    ],
    rules: {
        indent: [
            'error',
            4,
        ],
        'comma-dangle': [
            'error',
            'always-multiline',
        ],
        semi: [
            'error',
            'always',
        ],
        'no-extra-semi': 'error',
        'quote-props': [
            'error',
            'as-needed',
        ],
        'vue/html-indent': [
            'error',
            4,
        ],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
