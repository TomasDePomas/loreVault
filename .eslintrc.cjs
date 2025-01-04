module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
    '@vue/prettier',
  ],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'vue/require-typed-object-prop': 'error',
    'vue/require-typed-ref': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/valid-template-root': 'off',
    'vue/attributes-order': [
      'warn',
      {
        alphabetical: true,
      },
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'no-console': [
      'warn', { allow: ['warn', 'error', 'debug'] }
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
      }
    ],
    // 'vue/no-bare-strings-in-template': [
    //   'error',
    //   {
    //     allowlist: [
    //       '(', ')', ',', '.', '&', '+', '-', '=', '*', '/', '#', '%', '!', '?', ':', '[', ']', '{', '}', '<', '>',
    //       '\u00b7', '\u2022', '\u2010', '\u2013', '\u2014', '\u2212', '|',
    //     ],
    //     attributes: {
    //       '/.+/': [
    //         'title',
    //         'aria-label',
    //         'aria-placeholder',
    //         'aria-roledescription',
    //         'aria-valuetext',
    //       ],
    //       input: [
    //         'placeholder',
    //       ],
    //       img: [
    //         'alt',
    //       ],
    //     },
    //     directives: [
    //       'v-text',
    //     ],
    //   },
    // ],
  },
}
