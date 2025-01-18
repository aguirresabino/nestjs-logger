import { DEFAULT_APP_LOGGER, LOGGER_SUFFIX } from '../../src/constants';
import {
  getLoggerToken,
  getTokenOfLoggerThatOverrideNestLogger,
} from '../../src/helpers';

describe('getTokenOfLoggerThatOverrideNestLogger', () => {
  it('should return the token that overrides the NestJS default logger', () => {
    // Act
    const result = getTokenOfLoggerThatOverrideNestLogger();

    // Assert
    expect(result).toStrictEqual(DEFAULT_APP_LOGGER);
  });
});

describe('getLoggerToken', () => {
  it('should return the context as the token if it already ends with LOGGER_SUFFIX', () => {
    // Arrange
    const context = `Test${LOGGER_SUFFIX}`;

    // Act
    const result: string = getLoggerToken(context);

    // Assert
    expect(result).toStrictEqual(context);
  });

  it('should add LOGGER_SUFFIX to the context if it does not end with LOGGER_SUFFIX', () => {
    // Arrange
    const context = 'AnotherTest';
    const expected = `${context}${LOGGER_SUFFIX}`;

    // Act
    const result: string = getLoggerToken(context);

    // Assert
    expect(result).toStrictEqual(expected);
  });
});
