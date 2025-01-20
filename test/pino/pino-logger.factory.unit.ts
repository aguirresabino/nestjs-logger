/* eslint-disable @typescript-eslint/no-magic-numbers */
import { pino } from 'pino';

import { LoggerConfigOptions } from '../../src/interfaces';
import { PINO_LOGGER_OPTIONS_DEFAULT, PinoLoggerFactory } from '../../src/pino';

describe('PinoLoggerFactory', () => {
  describe('getOptions', () => {
    it('should return pino logger options with level info and enabled', () => {
      // Arrange
      const loggerOptions: LoggerConfigOptions = {
        pino: {
          level: 'info',
          enabled: true,
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
        },
      };
      const sut: PinoLoggerFactory = new PinoLoggerFactory(loggerOptions);

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
      const options: pino.LoggerOptions = sut['getOptions']();

      // Assert
      expect(options).toStrictEqual(expected);
    });

    it('should return pino logger options with level error and not enabled', () => {
      // Arrange
      const loggerOptions: LoggerConfigOptions = {
        pino: {
          level: 'error',
          enabled: false,
        },
      };
      const sut: PinoLoggerFactory = new PinoLoggerFactory(loggerOptions);

      const expected: pino.LoggerOptions = {
        enabled: false,
        level: 'error',
      };

      // Act
      const options: pino.LoggerOptions = sut['getOptions']();

      // Assert
      expect(options).toStrictEqual(expected);
    });

    it('should return pino logger options with default configuration when options are not provided', () => {
      // Arrange
      const sut: PinoLoggerFactory = new PinoLoggerFactory({});

      const expected: pino.LoggerOptions = PINO_LOGGER_OPTIONS_DEFAULT;

      // Act
      const options: pino.LoggerOptions = sut['getOptions']();

      // Assert
      expect(options).toStrictEqual(expected);
    });

    it('should return pino logger options with default configuration when options are null', () => {
      // Arrange
      const sut: PinoLoggerFactory = new PinoLoggerFactory(null as never);

      const expected: pino.LoggerOptions = PINO_LOGGER_OPTIONS_DEFAULT;

      // Act
      const options: pino.LoggerOptions = sut['getOptions']();

      // Assert
      expect(options).toStrictEqual(expected);
    });
  });

  describe('create', () => {
    it('should create a new pino logger with default configuration when context is not provided', () => {
      // Arrange
      const loggerOptions: LoggerConfigOptions = {
        pino: {
          level: 'info',
          enabled: true,
        },
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
        pino: {
          level: 'error',
          enabled: true,
        },
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
