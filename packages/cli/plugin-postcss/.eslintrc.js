module.exports = {
  root: true,
  extends: ['@modern-js'],
  ignorePatterns: ['compiled/'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
};
