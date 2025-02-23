import { AsyncLocalStorage } from 'async_hooks';

import {
  ConfigurableModuleAsyncOptions,
  DynamicModule,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppLoggerFactory } from './app.logger';
import {
  DEFAULT_APP_LOGGER,
  LOGGER_LOCAL_ASYNC_STORAGE,
  LOGGER_OPTIONS,
} from './helpers';
import {
  Logger,
  LoggerLocalAsyncStorage,
  LoggerModuleOptions,
  LoggerModuleOptionsFactory,
} from './interfaces';
import { LoggerLocalAsyncStorageInterceptor } from './logger-local-async-storage.interceptor';
import { loggerTokens } from './logger.provider';
import { createDecoratedPinoLoggerProviders, PinoLoggerFactory } from './pino';

@Module({})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
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
    options: ConfigurableModuleAsyncOptions<LoggerModuleOptions>
  ): DynamicModule {
    const decoratedPinoLoggerProviders: Provider<Logger>[] =
      createDecoratedPinoLoggerProviders(loggerTokens);

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: LoggerModule,
      imports: options.imports,
      global: true,
      providers: [
        ...asyncProviders,
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

  private static createAsyncProviders(
    options: ConfigurableModuleAsyncOptions<LoggerModuleOptions>
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: LOGGER_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    const useClass: Type<LoggerModuleOptionsFactory> =
      options.useClass as unknown as Type<LoggerModuleOptionsFactory>;

    return [
      {
        provide: useClass,
        useClass,
      },
      {
        provide: LOGGER_OPTIONS,
        useFactory: async (
          optionsFactory: LoggerModuleOptionsFactory
        ): Promise<LoggerModuleOptions> => await optionsFactory.create(),
        inject: [useClass],
      },
    ];
  }
}
