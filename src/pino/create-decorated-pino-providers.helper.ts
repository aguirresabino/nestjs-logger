import { AsyncLocalStorage } from 'async_hooks';
import pino from 'pino';

import { Provider } from '@nestjs/common';

import {
  getContextFromLoggerToken,
  LOGGER_LOCAL_ASYNC_STORAGE,
} from '../helpers';
import { Logger, LoggerLocalAsyncStorage } from '../interfaces';
import { PinoLoggerFactory } from './pino-logger.factory';
import { PinoLogger } from './pino.logger';

export function createDecoratedPinoLoggerProviders(
  loggerTokens: Set<string>
): Provider<Logger>[] {
  return [...loggerTokens].map<Provider<Logger>>(
    (token: string): Provider<Logger> => ({
      provide: token,
      inject: [PinoLoggerFactory, LOGGER_LOCAL_ASYNC_STORAGE],
      useFactory: (
        factory: PinoLoggerFactory,
        storage: AsyncLocalStorage<LoggerLocalAsyncStorage>
      ): Logger => {
        const context: string = getContextFromLoggerToken(token);
        const logger: pino.Logger = factory.create(context);
        return new PinoLogger(logger, storage);
      },
    })
  );
}
