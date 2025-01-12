const config = require('./jest.config');

module.exports = {
  ...config,
  maxWorkers: 1,
  testMatch: [
    '**/test/**/*.unit.[jt]s?(x)',
    '**/test/**/*.integration.[jt]s?(x)',
  ],
  testTimeout: 120000,
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: './test/coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'dist',
    'node_modules',
    'index.ts',
    '.interface.ts',
    '.type.ts',
    '.enum.ts',
    '.module.ts',
    '<rootDir>/src/main.ts',
  ],
};
