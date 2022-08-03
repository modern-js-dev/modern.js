module.exports = {
  root: true,
  extends: ['@modern-js'],
  parserOptions: {
    project: require.resolve('./tsconfig.json'),
  },
  rules: {
    'import/export': 'off',
    'import/namespace': 'off',
  },
};
