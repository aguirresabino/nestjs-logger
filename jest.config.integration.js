const config = require('./jest.config');

module.exports = {
  ...config,
  maxWorkers: '50%',
  testMatch: ['**/test/**/*.integration.[jt]s?(x)'],
  testTimeout: 120000,
};
