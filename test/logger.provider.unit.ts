import { Inject } from '@nestjs/common';

import { InjectLogger, loggerTokens } from '@src/logger.provider';

jest.mock<typeof import('@nestjs/common')>('@nestjs/common', () => {
  const actual: typeof import('@nestjs/common') =
    jest.requireActual('@nestjs/common');
  return {
    ...actual,
    Inject: jest.fn(),
  };
});

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
    const expected: PropertyDecorator & ParameterDecorator =
      'InjectResult' as unknown as PropertyDecorator & ParameterDecorator;

    jest.mocked(Inject).mockReturnValue(expected);

    // Act
    const result = InjectLogger(context);

    // Assert
    expect(result).toBe(expected);
  });
});
