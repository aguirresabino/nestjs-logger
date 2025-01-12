import { AsyncLocalStorage } from 'async_hooks';
import pino, { Level } from 'pino';

import {
  Logger,
  LoggerLocalAsyncStorage,
} from '@src/interfaces';

export class PinoLogger implements Logger {
  constructor(
    private readonly logger: pino.Logger,
    private readonly asyncStorage: AsyncLocalStorage<LoggerLocalAsyncStorage>
  ) {}

  fatal<T extends object>(data: T, message?: string): void {
    this.call<T>('fatal', data, message);
  }

  error<T extends object>(data: T, message?: string): void {
    this.call('error', data, message);
  }

  warn<T extends object>(data: T, message?: string): void {
    this.call<T>('warn', data, message);
  }

  info<T extends object>(data: T, message?: string): void {
    this.call<T>('info', data, message);
  }

  debug<T extends object>(data: T, message?: string): void {
    this.call<T>('debug', data, message);
  }

  trace<T extends object>(data: T, message?: string): void {
    this.call<T>('trace', data, message);
  }

  private call<T extends object>(
    level: Level,
    data: T,
    message?: string
  ): void {
    const correlationKey: LoggerLocalAsyncStorage | object =
      this.asyncStorage.getStore() ?? {};
    let args: Record<string, unknown> = correlationKey as unknown as Record<
      string,
      unknown
    >;

    if (data instanceof Error) {
      args.err = data;
    } else if (typeof data === 'object' && !Array.isArray(data)) {
      args = { ...args, ...data };
    } else {
      args = { ...args, data };
    }

    if (message) {
      this.logger[level](args, message);
    } else {
      this.logger[level](args);
    }
  }
}
