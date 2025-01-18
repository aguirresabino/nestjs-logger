import { AsyncLocalStorage } from 'async_hooks';

import {
  ConfigurableModuleAsyncOptions,
  DynamicModule,
  Module,
  Provider,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppLoggerFactory } from '@src/app.logger';
import {
  DEFAULT_APP_LOGGER,
  LOGGER_LOCAL_ASYNC_STORAGE,
  LOGGER_OPTIONS,
} from '@src/constants';
import {
  Logger,
  LoggerConfigOptions,
  LoggerLocalAsyncStorage,
} from '@src/interfaces';
import { LoggerLocalAsyncStorageInterceptor } from '@src/logger-local-async-storage.interceptor';
import { loggerTokens } from '@src/logger.provider';
import {
  createDecoratedPinoLoggerProviders,
  PinoLoggerFactory,
} from '@src/pino';

@Module({})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LoggerModule {
  static forRoot(options: LoggerConfigOptions): DynamicModule {
    const decoratedPinoLoggerProviders: Provider<Logger>[] =
      createDecoratedPinoLoggerProviders(loggerTokens);

    return {
      module: LoggerModule,
      global: true,
      providers: [
        {
          provide: LOGGER_OPTIONS,
          useValue: options,
        },
        {
          provide: LOGGER_LOCAL_ASYNC_STORAGE,
          useValue: new AsyncLocalStorage<LoggerLocalAsyncStorage>(),
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggerLocalAsyncStorageInterceptor,
        },
        PinoLoggerFactory,
        {
          provide: DEFAULT_APP_LOGGER,
          useValue: AppLoggerFactory.get(),
        },
        ...decoratedPinoLoggerProviders,
      ],
      exports: [DEFAULT_APP_LOGGER, ...decoratedPinoLoggerProviders],
    };
  }

  static forRootAsync(
    options: ConfigurableModuleAsyncOptions<LoggerConfigOptions>
  ): DynamicModule {
    const decoratedPinoLoggerProviders: Provider<Logger>[] =
      createDecoratedPinoLoggerProviders(loggerTokens);

    return {
      module: LoggerModule,
      imports: options.imports,
      global: true,
      providers: [
        {
          provide: LOGGER_OPTIONS,
          useFactory: options.useFactory as never,
          inject: options.inject,
        },
        {
          provide: LOGGER_LOCAL_ASYNC_STORAGE,
          useValue: new AsyncLocalStorage<LoggerLocalAsyncStorage>(),
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggerLocalAsyncStorageInterceptor,
        },
        PinoLoggerFactory,
        {
          provide: DEFAULT_APP_LOGGER,
          useValue: AppLoggerFactory.get(),
        },
        ...decoratedPinoLoggerProviders,
      ],
      exports: [DEFAULT_APP_LOGGER, ...decoratedPinoLoggerProviders],
    };
  }
}
