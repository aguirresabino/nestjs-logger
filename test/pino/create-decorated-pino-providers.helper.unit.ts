/* eslint-disable @typescript-eslint/unbound-method */
import { AsyncLocalStorage } from 'async_hooks';
import { Logger, pino } from 'pino';

import { FactoryProvider } from '@nestjs/common';

import { LOGGER_LOCAL_ASYNC_STORAGE } from '@src/constants';
import { LoggerLocalAsyncStorage } from '@src/interfaces';
import {
  createDecoratedPinoLoggerProviders,
  PinoLoggerFactory,
} from '@src/pino';

describe('createDecoratedPinoLoggerProviders', () => {
  it('should create decorated pino logger providers with correct dependencies', () => {
    // Arrange
    const loggerTokens: Set<string> = new Set<string>([
      'Context1Logger',
      'Context2Logger',
    ]);

    // Act
    const providers: FactoryProvider<Logger>[] =
      createDecoratedPinoLoggerProviders(
        loggerTokens
      ) as unknown as FactoryProvider<Logger>[];

    // Assert
    expect(providers).toHaveLength(loggerTokens.size);

    providers.forEach((provider: FactoryProvider<Logger>, index: number) => {
      expect(provider).toBeDefined();
      expect(provider.provide).toBe([...loggerTokens][index]);
      expect(provider.inject).toStrictEqual(
        expect.arrayContaining([PinoLoggerFactory, LOGGER_LOCAL_ASYNC_STORAGE])
      );
      expect(provider.useFactory).toBeDefined();
    });
  });

  it('should call PinoLoggerFactory.create with correct context for each logger provider', async () => {
    // Arrange
    const loggerTokens: Set<string> = new Set<string>([
      'Context1Logger',
      'Context2Logger',
    ]);

    const asyncStorage: jest.Mocked<
      AsyncLocalStorage<LoggerLocalAsyncStorage>
    > = {
      getStore: jest.fn(),
    } as unknown as jest.Mocked<AsyncLocalStorage<LoggerLocalAsyncStorage>>;

    const pinoLoggerFactory: jest.Mocked<PinoLoggerFactory> = {
      create: jest.fn().mockReturnValue(pino()),
    } as unknown as jest.Mocked<PinoLoggerFactory>;

    // Act
    const providers: FactoryProvider<Logger>[] =
      createDecoratedPinoLoggerProviders(
        loggerTokens
      ) as unknown as FactoryProvider<Logger>[];
    for (const provider of providers) {
      await provider.useFactory(pinoLoggerFactory, asyncStorage);
    }

    // Assert
    expect(pinoLoggerFactory.create).toHaveBeenCalledTimes(loggerTokens.size);
    expect(pinoLoggerFactory.create).toHaveBeenCalledWith('Context1');
    expect(pinoLoggerFactory.create).toHaveBeenCalledWith('Context2');
  });
});
