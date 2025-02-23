import { LOGGER_SUFFIX } from '../../src/constants';
import { getContextFromLoggerToken, getLoggerToken } from '../../src/helpers';

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

describe('getContextFromLoggerToken', () => {
  it('should extract the context from the token correctly', () => {
    // Arrange
    const token = 'TestLogger';
    const expectedContext = 'Test';

    // Act
    const result: string = getContextFromLoggerToken(token);

    // Assert
    expect(result).toStrictEqual(expectedContext);
  });

  it('should extract the context from the token with multiple words correctly', () => {
    // Arrange
    const token = 'AnotherTestLogger';
    const expectedContext = 'AnotherTest';

    // Act
    const result: string = getContextFromLoggerToken(token);

    // Assert
    expect(result).toStrictEqual(expectedContext);
  });

  it('should return the token itself if the context cannot be extracted', () => {
    // Arrange
    const token = 'LoggerTokenWithoutContext';

    // Act
    const result: string = getContextFromLoggerToken(token);

    // Assert
    expect(result).toStrictEqual(token);
  });

  it('should extract the context correctly from a token with "Logger" at the start of its name', () => {
    // Arrange
    const token = 'LoggerTokenLogger';
    const expectedContext = 'LoggerToken';

    // Act
    const result: string = getContextFromLoggerToken(token);

    // Assert
    expect(result).toStrictEqual(expectedContext);
  });

  it('should return "Logger" when the token is "Logger"', () => {
    // Arrange
    const token = 'Logger';
    const expected = 'Logger';

    // Act
    const result: string = getContextFromLoggerToken(token);

    // Assert
    expect(result).toStrictEqual(expected);
  });
});
