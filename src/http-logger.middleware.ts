import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';
import { ulid } from 'ulid';

import { Inject, Injectable, NestMiddleware } from '@nestjs/common';

import { LOGGER_LOCAL_ASYNC_STORAGE } from './helpers';
import { Logger, LoggerLocalAsyncStorage } from './interfaces';
import { InjectLogger } from './logger.provider';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectLogger(HttpLoggerMiddleware.name)
    private readonly logger: Logger,
    @Inject(LOGGER_LOCAL_ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<LoggerLocalAsyncStorage>
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const correlationKey: string =
      (req.headers['x-request-id'] as string) || ulid();
    const FIRST_IP_INDEX = 0;
    const ip: string =
      (Array.isArray(req.ips) && req.ips.length
        ? req.ips[FIRST_IP_INDEX]
        : req.ip) || 'unknown';

    this.logger.info(
      {
        correlationKey,
        request: {
          ip,
          httpVersion: req.httpVersion,
          protocol: req.protocol,
          query: req.query,
          method: req.method,
          originalUrl: req.originalUrl,
          headers: req.headers,
          body: req.body as never,
        },
        response: {
          statusCode: res.statusCode,
          headers: res.getHeaders(),
        },
      },
      `${req.method} ${req.originalUrl}`
    );
    const store: LoggerLocalAsyncStorage = { correlationKey };
    this.asyncStorage.run(store, () => {
      next();
    });
  }
}
