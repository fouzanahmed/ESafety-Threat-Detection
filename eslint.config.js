// ESLint flat config for the Express backend. The React front ends
// (client/, esafety-frontend/) have their own lint setup and are not covered here.
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'client/**',
      'esafety-frontend/**',
      'youtube-safety-extension/**'
    ]
  },
  {
    files: ['server/**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      // Express error middleware must declare all four args, including `next`.
      // Pre-existing unused variables are reported as warnings rather than
      // errors so the lint gate can land before that cleanup is done.
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_|^next$',
        varsIgnorePattern: '^_',
        caughtErrors: 'none'
      }],
      'no-useless-escape': 'warn'
    }
  },
  {
    files: ['server/__tests__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  }
];
