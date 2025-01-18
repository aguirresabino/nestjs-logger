import { getContextFromLoggerToken } from '../../src/helpers/get-context.helper';

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
