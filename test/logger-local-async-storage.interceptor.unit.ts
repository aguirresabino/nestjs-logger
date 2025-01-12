/* eslint-disable @typescript-eslint/unbound-method */
import { AsyncLocalStorage } from 'async_hooks';

import { CallHandler, ExecutionContext } from '@nestjs/common';

import { LoggerLocalAsyncStorage } from '@src/interfaces';
import { LoggerLocalAsyncStorageInterceptor } from '@src/logger-local-async-storage.interceptor';

describe('LoggerLocalAsyncStorageInterceptor', () => {
  it('should enter a new async storage when no store exists', async () => {
    expect.hasAssertions();

    // Arrange
    const sut: Sut = makeSut();

    const interceptor: LoggerLocalAsyncStorageInterceptor = sut.interceptor;

    const context: ExecutionContext = {} as ExecutionContext;
    const next: CallHandler = {
      handle: jest.fn(),
    };

    const asyncStorage: jest.Mocked<
      AsyncLocalStorage<LoggerLocalAsyncStorage>
    > = sut.asyncStorage as jest.Mocked<
      AsyncLocalStorage<LoggerLocalAsyncStorage>
    >;
    asyncStorage.getStore.mockReturnValue(undefined);

    // Act
    await interceptor.intercept(context, next);

    // Assert
    expect(asyncStorage.getStore).toHaveBeenCalledWith();
    expect(asyncStorage.enterWith).toHaveBeenCalledWith(
      expect.objectContaining({
        correlationKey: expect.stringMatching(/^[\w\d]{26}$/) as never, // ulid format
      })
    );
    expect(next.handle).toHaveBeenCalledWith();
  });

  it('should not enter a new async storage store when a store already exists', async () => {
    expect.hasAssertions();

    // Arrange
    const sut: Sut = makeSut();

    const interceptor: LoggerLocalAsyncStorageInterceptor = sut.interceptor;

    const context: ExecutionContext = {} as ExecutionContext;
    const next: CallHandler = {
      handle: jest.fn(),
    };

    const asyncStorage: jest.Mocked<
      AsyncLocalStorage<LoggerLocalAsyncStorage>
    > = sut.asyncStorage as jest.Mocked<
      AsyncLocalStorage<LoggerLocalAsyncStorage>
    >;
    const store = { correlationKey: 'abc123' };
    asyncStorage.getStore.mockReturnValue(store);

    // Act
    await interceptor.intercept(context, next);

    // Assert
    expect(asyncStorage.getStore).toHaveBeenCalledWith();
    expect(asyncStorage.enterWith).not.toHaveBeenCalledWith();
    expect(next.handle).toHaveBeenCalledWith();
  });
});

interface Sut {
  interceptor: LoggerLocalAsyncStorageInterceptor;
  asyncStorage: AsyncLocalStorage<LoggerLocalAsyncStorage>;
}

function makeSut(): Sut {
  const asyncStorage: AsyncLocalStorage<LoggerLocalAsyncStorage> = {
    getStore: jest.fn(),
    enterWith: jest.fn(),
  } as unknown as AsyncLocalStorage<LoggerLocalAsyncStorage>;

  const interceptor: LoggerLocalAsyncStorageInterceptor =
    new LoggerLocalAsyncStorageInterceptor(asyncStorage);

  return {
    asyncStorage,
    interceptor,
  };
}
