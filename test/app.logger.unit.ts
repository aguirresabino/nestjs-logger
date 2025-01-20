import { AsyncLocalStorage } from 'async_hooks';
import pino from 'pino';

import { AppLogger, AppLoggerFactory } from '../src/app.logger';
import { LoggerLocalAsyncStorage } from '../src/interfaces';
import { PINO_LOGGER_OPTIONS_DEFAULT, PinoLoggerFactory } from '../src/pino';

jest.mock('pino');

describe('AppLogger', () => {
  describe('createLogger', () => {
    it('should create a logger using the factory if provided', () => {
      // Arrange
      const { sut, pinoLoggerFactory, logger } = makeSut();

      // Act
      const createdLogger: pino.Logger = sut['createLogger']();

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(pinoLoggerFactory.create).toHaveBeenCalledWith();
      expect(createdLogger).toBe(logger);
    });

    it('should create a logger using the provided options if factory is not provided', () => {
      // Arrange
      const options = { level: 'debug' };
      const sut: AppLogger = new AppLogger(undefined, undefined, {
        pino: options,
      });
      const pinoSpy = jest.spyOn(pino as never, 'default');

      // Act
      sut['createLogger']();

      // Assert
      expect(pinoSpy).toHaveBeenCalledWith(options);

      pinoSpy.mockRestore();
    });

    it('should create a logger using default options if neither factory nor options are provided', () => {
      // Arrange
      const sut = new AppLogger();
      const pinoSpy = jest.spyOn(pino as never, 'default');

      // Act
      sut['createLogger']();

      expect(pinoSpy).toHaveBeenCalledWith(PINO_LOGGER_OPTIONS_DEFAULT);

      pinoSpy.mockRestore();
    });
  });

  describe('error', () => {
    it('should call pino logger with the correct level and message for error', () => {
      // Arrange
      process.env.NODE_ENV = 'test';
      const { sut } = makeSut();
      const errorSpy = jest.spyOn(sut['logger'], 'error');
      const message = 'Test error message';

      // Act
      sut.error(message);

      // Assert
      expect(errorSpy).toHaveBeenCalledWith({}, message);
    });

    it('should call pino logger with correlationKey and message for error', () => {
      // Arrange
      const { sut, asyncStorage } = makeSut();
      const errorSpy = jest.spyOn(sut['logger'], 'error');
      const message = 'Test error message';
      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValueOnce({ correlationKey });

      // Act
      sut.error(message);

      // Assert
      expect(errorSpy).toHaveBeenCalledWith({ correlationKey }, message);
    });

    it('should call pino logger with the correct level, message, and context for error with optionalParams', () => {
      // Arrange
      process.env.NODE_ENV = 'test';
      const { sut } = makeSut();
      const errorSpy = jest.spyOn(sut['logger'], 'error');
      const message = 'Test error message';
      const context = 'Test context';

      // Act
      sut.error(message, context);

      // Assert
      expect(errorSpy).toHaveBeenCalledWith({ context }, message);
    });

    it('should call pino logger with the correct level, message, and context for error when message is an instance of Error', () => {
      // Arrange
      process.env.NODE_ENV = 'test';
      const { sut } = makeSut();
      const errorSpy = jest.spyOn(sut['logger'], 'error');
      const error = new Error('Test error message');
      const context = 'Test context';

      // Act
      sut.error(error, context);

      // Assert
      expect(errorSpy).toHaveBeenCalledWith({ context, err: error });
    });

    it('should call pino logger with the correct level, message, and context for error when message is an object', () => {
      // Arrange
      process.env.NODE_ENV = 'test';
      const { sut } = makeSut();
      const errorSpy = jest.spyOn(sut['logger'], 'error');
      const message = { param1: 1, param2: 2 };
      const context = 'Test context';

      // Act
      sut.error(message, context);

      // Assert
      expect(errorSpy).toHaveBeenCalledWith({ context, ...message });
    });

    it('should call pino logger with error object when call .error with not supported contract', () => {
      // Arrange
      process.env.NODE_ENV = 'test';
      const { sut } = makeSut();
      const errorSpy = jest.spyOn(sut['logger'], 'error');
      const message = 'Test error message';
      const error = new Error(message);

      // Act
      sut.error(error.message, error.stack);

      // Assert
      expect(errorSpy).toHaveBeenCalledWith({
        err: error,
      });
    });
  });

  describe('warn', () => {
    it('should call pino logger with the correct level and message for warn', () => {
      // Arrange
      process.env.NODE_ENV = 'test';
      const { sut } = makeSut();
      const warnSpy = jest.spyOn(sut['logger'], 'warn');
      const message = 'Test warn message';

      // Act
      sut.warn(message);

      // Assert
      expect(warnSpy).toHaveBeenCalledWith({}, message);
    });
  });

  describe('log', () => {
    it('should call pino logger with the correct level and message for log', () => {
      // Arrange
      process.env.NODE_ENV = 'test';
      const { sut } = makeSut();
      const infoSpy = jest.spyOn(sut['logger'], 'info');
      const message = 'Test log message';

      // Act
      sut.log(message);

      // Assert
      expect(infoSpy).toHaveBeenCalledWith({}, message);
    });
  });

  describe('debug', () => {
    it('should call pino logger with the correct level and message for debug', () => {
      // Arrange
      process.env.NODE_ENV = 'test';
      const { sut } = makeSut();
      const debugSpy = jest.spyOn(sut['logger'], 'debug');
      const message = 'Test debug message';

      // Act
      sut.debug(message);

      // Assert
      expect(debugSpy).toHaveBeenCalledWith({}, message);
    });
  });

  describe('verbose', () => {
    it('should call pino logger with the correct level and message for verbose', () => {
      // Arrange
      process.env.NODE_ENV = 'test';
      const { sut } = makeSut();
      const traceSpy = jest.spyOn(sut['logger'], 'trace');
      const message = 'Test verbose message';

      // Act
      sut.verbose(message);

      // Assert
      expect(traceSpy).toHaveBeenCalledWith({}, message);
    });
  });
});

describe('AppLoggerFactory', () => {
  it('should return the same instance of AppLogger', () => {
    // Act
    const logger1: AppLogger = AppLoggerFactory.get();
    const logger2: AppLogger = AppLoggerFactory.get();

    // Assert
    expect(logger1).toBe(logger2);
  });
});

interface Sut {
  asyncStorage: jest.Mocked<AsyncLocalStorage<LoggerLocalAsyncStorage>>;
  logger: jest.Mocked<pino.Logger>;
  pinoLoggerFactory: jest.Mocked<PinoLoggerFactory>;
  sut: AppLogger;
}

function makeSut(): Sut {
  const asyncStorage: jest.Mocked<AsyncLocalStorage<LoggerLocalAsyncStorage>> =
    {
      getStore: jest.fn(),
    } as unknown as jest.Mocked<AsyncLocalStorage<LoggerLocalAsyncStorage>>;

  const logger: jest.Mocked<pino.Logger> = {
    fatal: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  } as unknown as jest.Mocked<pino.Logger>;

  const pinoLoggerFactory: jest.Mocked<PinoLoggerFactory> = {
    create: jest.fn().mockReturnValue(logger),
  } as unknown as jest.Mocked<PinoLoggerFactory>;

  const sut: AppLogger = new AppLogger(asyncStorage, pinoLoggerFactory);

  return {
    asyncStorage,
    logger,
    pinoLoggerFactory,
    sut,
  };
}
