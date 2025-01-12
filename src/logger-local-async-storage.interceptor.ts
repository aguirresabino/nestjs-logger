import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';
import { ulid } from 'ulid';

import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { LOGGER_LOCAL_ASYNC_STORAGE } from '@src/constants';
import { LoggerLocalAsyncStorage } from '@src/interfaces';

@Injectable()
export class LoggerLocalAsyncStorageInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOGGER_LOCAL_ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<LoggerLocalAsyncStorage>
  ) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const store: LoggerLocalAsyncStorage | undefined =
      this.asyncStorage.getStore();
    if (!store) {
      const newStore: LoggerLocalAsyncStorage = { correlationKey: ulid() };
      this.asyncStorage.enterWith(newStore);
    }
    return next.handle();
  }
}
