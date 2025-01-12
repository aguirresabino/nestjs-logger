import { Inject } from '@nestjs/common';
import { InjectLogger, loggerTokens } from '@src/logger.provider';

jest.mock('@nestjs/common', () => ({
  Inject: jest.fn(),
}));

describe('InjectLogger', () => {
  it('should add the token to loggerTokens', () => {
    // Arrange
    const context = 'TestContext';
    const expected = 'TestContextLogger';

    // Act
    InjectLogger(context);

    // Assert
    expect(loggerTokens.has(expected)).toBe(true);
  });

  it('should return the result of Inject', () => {
    // Arrange
    const context = 'TestContext';
    const expected = 'InjectResult';

    (Inject as jest.Mock).mockReturnValue(expected);

    // Act
    const result = InjectLogger(context);

    // Assert
    expect(result).toBe(expected);
  });
});