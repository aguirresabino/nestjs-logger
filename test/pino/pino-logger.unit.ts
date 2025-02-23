import { AsyncLocalStorage } from 'async_hooks';
import { pino } from 'pino';

import { LoggerLocalAsyncStorage } from '../../src/interfaces';
import { PinoLogger } from '../../src/pino';

describe('PinoLogger', () => {
  describe('getCorrelationKey', () => {
    it('should return the correlationKey if set in asyncStorage', () => {
      // Arrange
      const { asyncStorage, sut } = makeSut();
      const correlationKey = 'test-key';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      // Act
      const result = sut.getCorrelationKey();

      // Assert
      expect(result).toBe(correlationKey);
    });

    it('should return empty string when asyncStorage returns an empty object', () => {
      // Arrange
      const { asyncStorage, sut } = makeSut();
      asyncStorage.getStore.mockReturnValue({} as never);

      // Act
      const result = sut.getCorrelationKey();

      // Assert
      expect(result).toBe('');
    });

    it('should return empty string when asyncStorage.getStore returns undefined', () => {
      // Arrange
      const { asyncStorage, sut } = makeSut();
      asyncStorage.getStore.mockReturnValue(undefined);

      // Act
      const result = sut.getCorrelationKey();

      // Assert
      expect(result).toBe('');
    });
  });

  describe('fatal', () => {
    it('should call logger.fatal with correlationKey, context, optionalParams and message when data is an object but not Array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test fatal message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const fatalSpy = jest.spyOn(sut['logger'], 'fatal');

      // Act
      sut.fatal(data, message);

      // Assert
      expect(fatalSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          ...data,
        },
        message
      );
    });

    it('should call logger.fatal with message, correlationKey and data when data is an array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test fatal message';
      const data = ['param1', 'param2'];

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const fatalSpy = jest.spyOn(sut['logger'], 'fatal');

      // Act
      sut.fatal(data, message);

      // Assert
      expect(fatalSpy).toHaveBeenCalledWith({ correlationKey, data }, message);
    });

    it('should call logger.fatal with correlationKey, context, and optionalParams when data is an object but not Array and message is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const fatalSpy = jest.spyOn(sut['logger'], 'fatal');

      // Act
      sut.fatal(data);

      // Assert
      expect(fatalSpy).toHaveBeenCalledWith({
        correlationKey,
        ...data,
      });
    });

    it('should call logger.fatal with correlationKey, context, and data when data is an instance of Error', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test error';
      const data = new Error(message);

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const fatalSpy = jest.spyOn(sut['logger'], 'fatal');

      // Act
      sut.fatal(data, message);

      // Assert
      expect(fatalSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          err: data,
        },
        message
      );
    });

    it('should call logger.fatal with context, optionalParams and message when data is an object but not Array and correlationKey is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test fatal message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      asyncStorage.getStore.mockReturnValue(undefined);

      const fatalSpy = jest.spyOn(sut['logger'], 'fatal');

      // Act
      sut.fatal(data, message);

      // Assert
      expect(fatalSpy).toHaveBeenCalledWith(
        {
          ...data,
        },
        message
      );
    });
  });

  describe('error', () => {
    it('should call logger.error with correlationKey, context, optionalParams and message when data is an object but not Array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test fatal message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const errorSpy = jest.spyOn(sut['logger'], 'error');

      // Act
      sut.error(data, message);

      // Assert
      expect(errorSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          ...data,
        },
        message
      );
    });

    it('should call logger.error with message, correlationKey and data when data is an array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test error message';
      const data = ['param1', 'param2'];

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const errorSpy = jest.spyOn(sut['logger'], 'error');

      // Act
      sut.error(data, message);

      // Assert
      expect(errorSpy).toHaveBeenCalledWith({ correlationKey, data }, message);
    });

    it('should call logger.error with correlationKey, context, and optionalParams when data is an object but not Array and message is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const errorSpy = jest.spyOn(sut['logger'], 'error');

      // Act
      sut.error(data);

      // Assert
      expect(errorSpy).toHaveBeenCalledWith({
        correlationKey,
        ...data,
      });
    });

    it('should call logger.error with correlationKey, context, and data when data is an instance of Error', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test error';
      const data = new Error(message);

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const errorSpy = jest.spyOn(sut['logger'], 'error');

      // Act
      sut.error(data, message);

      // Assert
      expect(errorSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          err: data,
        },
        message
      );
    });

    it('should call logger.error with context, optionalParams and message when data is an object but not Array and correlationKey is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test error message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      asyncStorage.getStore.mockReturnValue(undefined);

      const errorSpy = jest.spyOn(sut['logger'], 'error');

      // Act
      sut.error(data, message);

      // Assert
      expect(errorSpy).toHaveBeenCalledWith(
        {
          ...data,
        },
        message
      );
    });
  });

  describe('warn', () => {
    it('should call logger.warn with correlationKey, context, optionalParams and message when data is an object but not Array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test fatal message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const warnSpy = jest.spyOn(sut['logger'], 'warn');

      // Act
      sut.warn(data, message);

      // Assert
      expect(warnSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          ...data,
        },
        message
      );
    });

    it('should call logger.warn with message, correlationKey and data when data is an array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test warn message';
      const data = ['param1', 'param2'];

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const warnSpy = jest.spyOn(sut['logger'], 'warn');

      // Act
      sut.warn(data, message);

      // Assert
      expect(warnSpy).toHaveBeenCalledWith({ correlationKey, data }, message);
    });

    it('should call logger.warn with correlationKey, context, and optionalParams when data is an object but not Array and message is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const warnSpy = jest.spyOn(sut['logger'], 'warn');

      // Act
      sut.warn(data);

      // Assert
      expect(warnSpy).toHaveBeenCalledWith({
        correlationKey,
        ...data,
      });
    });

    it('should call logger.warn with correlationKey, context, and data when data is an instance of Error', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test warn';
      const data = new Error(message);

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const warnSpy = jest.spyOn(sut['logger'], 'warn');

      // Act
      sut.warn(data, message);

      // Assert
      expect(warnSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          err: data,
        },
        message
      );
    });

    it('should call logger.warn with context, optionalParams and message when data is an object but not Array and correlationKey is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test warn message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      asyncStorage.getStore.mockReturnValue(undefined);

      const warnSpy = jest.spyOn(sut['logger'], 'warn');

      // Act
      sut.warn(data, message);

      // Assert
      expect(warnSpy).toHaveBeenCalledWith(
        {
          ...data,
        },
        message
      );
    });
  });

  describe('info', () => {
    it('should call logger.info with correlationKey, context, optionalParams and message when data is an object but not Array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test fatal message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const infoSpy = jest.spyOn(sut['logger'], 'info');

      // Act
      sut.info(data, message);

      // Assert
      expect(infoSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          ...data,
        },
        message
      );
    });

    it('should call logger.info with message, correlationKey and data when data is an array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test info message';
      const data = ['param1', 'param2'];

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const infoSpy = jest.spyOn(sut['logger'], 'info');

      // Act
      sut.info(data, message);

      // Assert
      expect(infoSpy).toHaveBeenCalledWith({ correlationKey, data }, message);
    });

    it('should call logger.info with correlationKey, context, and optionalParams when data is an object but not Array and message is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const infoSpy = jest.spyOn(sut['logger'], 'info');

      // Act
      sut.info(data);

      // Assert
      expect(infoSpy).toHaveBeenCalledWith({
        correlationKey,
        ...data,
      });
    });

    it('should call logger.info with correlationKey, context, and data when data is an instance of Error', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test info';
      const data = new Error(message);

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const infoSpy = jest.spyOn(sut['logger'], 'info');

      // Act
      sut.info(data, message);

      // Assert
      expect(infoSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          err: data,
        },
        message
      );
    });

    it('should call logger.info with context, optionalParams and message when data is an object but not Array and correlationKey is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test info message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      asyncStorage.getStore.mockReturnValue(undefined);

      const infoSpy = jest.spyOn(sut['logger'], 'info');

      // Act
      sut.info(data, message);

      // Assert
      expect(infoSpy).toHaveBeenCalledWith(
        {
          ...data,
        },
        message
      );
    });
  });

  describe('debug', () => {
    it('should call logger.debug with correlationKey, context, optionalParams and message when data is an object but not Array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test fatal message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const debugSpy = jest.spyOn(sut['logger'], 'debug');

      // Act
      sut.debug(data, message);

      // Assert
      expect(debugSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          ...data,
        },
        message
      );
    });

    it('should call logger.debug with message, correlationKey and data when data is an array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test debug message';
      const data = ['param1', 'param2'];

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const debugSpy = jest.spyOn(sut['logger'], 'debug');

      // Act
      sut.debug(data, message);

      // Assert
      expect(debugSpy).toHaveBeenCalledWith({ correlationKey, data }, message);
    });

    it('should call logger.debug with correlationKey, context, and optionalParams when data is an object but not Array and message is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const debugSpy = jest.spyOn(sut['logger'], 'debug');

      // Act
      sut.debug(data);

      // Assert
      expect(debugSpy).toHaveBeenCalledWith({
        correlationKey,
        ...data,
      });
    });

    it('should call logger.debug with correlationKey, context, and data when data is an instance of Error', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test debug';
      const data = new Error(message);

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const debugSpy = jest.spyOn(sut['logger'], 'debug');

      // Act
      sut.debug(data, message);

      // Assert
      expect(debugSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          err: data,
        },
        message
      );
    });

    it('should call logger.debug with context, optionalParams and message when data is an object but not Array and correlationKey is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test debug message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      asyncStorage.getStore.mockReturnValue(undefined);

      const debugSpy = jest.spyOn(sut['logger'], 'debug');

      // Act
      sut.debug(data, message);

      // Assert
      expect(debugSpy).toHaveBeenCalledWith(
        {
          ...data,
        },
        message
      );
    });
  });

  describe('trace', () => {
    it('should call logger.trace with correlationKey, context, optionalParams and message when data is an object but not Array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test fatal message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const traceSpy = jest.spyOn(sut['logger'], 'trace');

      // Act
      sut.trace(data, message);

      // Assert
      expect(traceSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          ...data,
        },
        message
      );
    });

    it('should call logger.trace with message, correlationKey and data when data is an array', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test trace message';
      const data = ['param1', 'param2'];

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const traceSpy = jest.spyOn(sut['logger'], 'trace');

      // Act
      sut.trace(data, message);

      // Assert
      expect(traceSpy).toHaveBeenCalledWith({ correlationKey, data }, message);
    });

    it('should call logger.trace with correlationKey, context, and optionalParams when data is an object but not Array and message is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const traceSpy = jest.spyOn(sut['logger'], 'trace');

      // Act
      sut.trace(data);

      // Assert
      expect(traceSpy).toHaveBeenCalledWith({
        correlationKey,
        ...data,
      });
    });

    it('should call logger.trace with correlationKey, context, and data when data is an instance of Error', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test trace';
      const data = new Error(message);

      const correlationKey = 'testCorrelationKey';
      asyncStorage.getStore.mockReturnValue({ correlationKey });

      const traceSpy = jest.spyOn(sut['logger'], 'trace');

      // Act
      sut.trace(data, message);

      // Assert
      expect(traceSpy).toHaveBeenCalledWith(
        {
          correlationKey,
          err: data,
        },
        message
      );
    });

    it('should call logger.trace with context, optionalParams and message when data is an object but not Array and correlationKey is undefined', () => {
      expect.hasAssertions();

      // Arrange
      const { asyncStorage, sut } = makeSut();
      const message = 'Test trace message';
      const context = 'Test context';
      const optionalParams = { param1: 'value1', param2: 'value2' };

      const data = { context, optionalParams };

      asyncStorage.getStore.mockReturnValue(undefined);

      const traceSpy = jest.spyOn(sut['logger'], 'trace');

      // Act
      sut.trace(data, message);

      // Assert
      expect(traceSpy).toHaveBeenCalledWith(
        {
          ...data,
        },
        message
      );
    });
  });
});

interface Sut {
  asyncStorage: jest.Mocked<AsyncLocalStorage<LoggerLocalAsyncStorage>>;
  logger: jest.Mocked<pino.Logger>;
  sut: PinoLogger;
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

  const sut: PinoLogger = new PinoLogger(logger, asyncStorage);

  return {
    sut,
    logger,
    asyncStorage,
  };
}
