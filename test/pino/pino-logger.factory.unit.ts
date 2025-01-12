/* eslint-disable @typescript-eslint/no-magic-numbers */
import { pino } from 'pino';

import { LoggerConfigOptions } from '@src/interfaces';
import { PinoLoggerFactory } from '@src/pino';

describe('PinoLoggerFactory', () => {
  describe('configurePrettyOptions', () => {
    it('should return pino logger options with level info and enabled', () => {
      // Arrange
      const loggerOptions: LoggerConfigOptions = {
        level: 'info',
        enabled: true,
        nodeEnv: 'test',
      };

      const expected: pino.LoggerOptions = {
        enabled: true,
        level: 'info',
        redact: ['req.authorization', 'password'],
        transport: {
          target: 'pino-pretty',
          options: {
            levelFirst: true,
            singleLine: true,
            messageFormat:
              '{hostname} {correlationKey} [{context}] - {msg} - {stackTrace}',
          },
        },
      };

      // Act
      const options: pino.LoggerOptions =
        PinoLoggerFactory['configurePrettyOptions'](loggerOptions);

      // Assert
      expect(options).toStrictEqual(expected);
    });

    it('should return pino logger options with level error and not enabled', () => {
      // Arrange
      const loggerOptions: LoggerConfigOptions = {
        level: 'error',
        enabled: false,
        nodeEnv: 'test',
      };

      const expected: pino.LoggerOptions = {
        enabled: false,
        level: 'error',
        redact: ['req.authorization', 'password'],
        transport: {
          target: 'pino-pretty',
          options: {
            levelFirst: true,
            singleLine: true,
            messageFormat:
              '{hostname} {correlationKey} [{context}] - {msg} - {stackTrace}',
          },
        },
      };

      // Act
      const options: pino.LoggerOptions =
        PinoLoggerFactory['configurePrettyOptions'](loggerOptions);

      // Assert
      expect(options).toStrictEqual(expected);
    });

    it('should return pino logger options not enabled when the enabled option is undefined', () => {
      // Arrange
      const loggerOptions: LoggerConfigOptions = {
        level: 'info',
        enabled: undefined,
        nodeEnv: 'test',
      };

      const expected: pino.LoggerOptions = {
        enabled: true,
        level: 'info',
        redact: ['req.authorization', 'password'],
        transport: {
          target: 'pino-pretty',
          options: {
            levelFirst: true,
            singleLine: true,
            messageFormat:
              '{hostname} {correlationKey} [{context}] - {msg} - {stackTrace}',
          },
        },
      };

      // Act
      const options: pino.LoggerOptions =
        PinoLoggerFactory['configurePrettyOptions'](loggerOptions);

      // Assert
      expect(options).toStrictEqual(expected);
    });

    it('should return pino logger options not enabled when the enabled option is null', () => {
      // Arrange
      const loggerOptions: LoggerConfigOptions = {
        level: 'info',
        enabled: null as unknown as boolean,
        nodeEnv: 'test',
      };

      const expected: pino.LoggerOptions = {
        enabled: true,
        level: 'info',
        redact: ['req.authorization', 'password'],
        transport: {
          target: 'pino-pretty',
          options: {
            levelFirst: true,
            singleLine: true,
            messageFormat:
              '{hostname} {correlationKey} [{context}] - {msg} - {stackTrace}',
          },
        },
      };

      // Act
      const options: pino.LoggerOptions =
        PinoLoggerFactory['configurePrettyOptions'](loggerOptions);

      // Assert
      expect(options).toStrictEqual(expected);
    });
  });

  describe('create', () => {
    it('should create a new pino logger with default configuration when context is not provided', () => {
      // Arrange
      const loggerOptions: LoggerConfigOptions = {
        level: 'info',
        enabled: true,
        nodeEnv: 'test',
      };

      const sut: PinoLoggerFactory = new PinoLoggerFactory(loggerOptions);

      // Act
      const logger: pino.Logger = sut.create();

      // Assert
      expect(logger.level).toBe('info');
      expect(logger.levelVal).toBe(30);
    });

    it('should create a new pino logger with provided context', () => {
      // Arrange
      const context = 'TestContext';

      const loggerOptions: LoggerConfigOptions = {
        level: 'error',
        enabled: true,
        nodeEnv: 'test',
      };
      const sut: PinoLoggerFactory = new PinoLoggerFactory(loggerOptions);

      // Act
      const logger: pino.Logger = sut.create(context);

      // Assert
      expect(logger.level).toBe('error');
      expect(logger.levelVal).toBe(50);
      expect(logger.bindings()).toStrictEqual(
        expect.objectContaining({ context })
      );
    });
  });
});
