const config = require('./jest.config');

module.exports = {
  ...config,
  maxWorkers: '50%',
  testMatch: ['**/test/**/*.unit.[jt]s?(x)'],
};
