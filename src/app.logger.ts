/* eslint-disable @typescript-eslint/no-magic-numbers */
import { AsyncLocalStorage } from 'async_hooks';
import { Level, pino } from 'pino';

import { Inject, Injectable, LoggerService, Optional } from '@nestjs/common';

import { LOGGER_LOCAL_ASYNC_STORAGE } from './helpers';
import { LoggerLocalAsyncStorage, LoggerModuleOptions } from './interfaces';
import { PINO_LOGGER_OPTIONS_DEFAULT, PinoLoggerFactory } from './pino';

/**
 * This class was copied and improved from the nestjs-pino package,
 * which is an open source repository and uses the MIT license.
 *
 * This is the exact copied and improved version:
 * https://github.com/iamolegga/nestjs-pino/blob/eea8627e1b0300038a074396cd43dcb6849031be/src/Logger.ts
 */
@Injectable()
export class AppLogger implements LoggerService {
  private readonly contextName: string = 'context';
  private readonly logger: pino.Logger;

  constructor(
    @Optional()
    @Inject(LOGGER_LOCAL_ASYNC_STORAGE)
    private readonly asyncStorage?: AsyncLocalStorage<LoggerLocalAsyncStorage>,
    @Optional() private readonly factory?: PinoLoggerFactory,
    @Optional() private readonly options?: LoggerModuleOptions
  ) {
    this.logger = this.createLogger();
  }

  private createLogger(): pino.Logger {
    if (this.factory) {
      return this.factory.create();
    }
    if (this.options?.pino) {
      return pino(this.options.pino);
    }
    return pino(PINO_LOGGER_OPTIONS_DEFAULT);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.call('error', message, ...optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.call('warn', message, ...optionalParams);
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.call('info', message, ...optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.call('debug', message, ...optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.call('trace', message, ...optionalParams);
  }

  private call(
    level: Level,
    message: unknown,
    ...optionalParams: unknown[]
  ): void {
    const correlationKey: LoggerLocalAsyncStorage | object =
      this.asyncStorage?.getStore() ?? {};
    const objArg: Record<string, unknown> = correlationKey as Record<
      string,
      unknown
    >;

    // optionalParams contains extra params passed to logger
    // context name is the last item
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let params: any[] = optionalParams;
    if (
      optionalParams.length &&
      !this.isWrongExceptionsHandlerContract(level, message, params)
    ) {
      objArg[this.contextName] = optionalParams[optionalParams.length - 1];
      params = optionalParams.slice(0, -1);
    }

    if (typeof message === 'object') {
      if (message instanceof Error) {
        objArg.err = message;
      } else {
        Object.assign(objArg, message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.logger[level](objArg as unknown, ...params);
    } else if (this.isWrongExceptionsHandlerContract(level, message, params)) {
      const err = new Error(message as string);
      err.stack = params[0];
      objArg.err = err;
      this.logger[level](objArg);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.logger[level](objArg as unknown, message as string, ...params);
    }
  }

  /**
   * Unfortunately built-in (not only) `^.*Exception(s?)Handler$` classes call `.error`
   * method with not supported contract:
   *
   * - ExceptionsHandler
   * @see https://github.com/nestjs/nest/blob/35baf7a077bb972469097c5fea2f184b7babadfc/packages/core/exceptions/base-exception-filter.ts#L60-L63
   *
   * - ExceptionHandler
   * @see https://github.com/nestjs/nest/blob/99ee3fd99341bcddfa408d1604050a9571b19bc9/packages/core/errors/exception-handler.ts#L9
   *
   * - WsExceptionsHandler
   * @see https://github.com/nestjs/nest/blob/9d0551ff25c5085703bcebfa7ff3b6952869e794/packages/websockets/exceptions/base-ws-exception-filter.ts#L47-L50
   *
   * - RpcExceptionsHandler @see https://github.com/nestjs/nest/blob/9d0551ff25c5085703bcebfa7ff3b6952869e794/packages/microservices/exceptions/base-rpc-exception-filter.ts#L26-L30
   *
   * - all of them
   * @see https://github.com/search?l=TypeScript&q=org%3Anestjs+logger+error+stack&type=Code
   */
  private isWrongExceptionsHandlerContract(
    level: Level,
    message: unknown,
    params: unknown[]
  ): params is [string] {
    return (
      level === 'error' &&
      typeof message === 'string' &&
      params.length === 1 &&
      typeof params[0] === 'string' &&
      /\n\s*at /.test(params[0])
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppLoggerFactory {
  private static logger: AppLogger = new AppLogger();

  static get(): AppLogger {
    return this.logger;
  }
}
