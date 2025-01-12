import pino from 'pino';

import { Inject, Injectable } from '@nestjs/common';

import { LOGGER_OPTIONS } from '@src/constants';
import { LoggerConfigOptions } from '@src/interfaces';

@Injectable()
export class PinoLoggerFactory {
  private readonly logger: pino.Logger;

  constructor(
    @Inject(LOGGER_OPTIONS) private readonly options: LoggerConfigOptions
  ) {
    this.logger = pino(PinoLoggerFactory.configurePrettyOptions(this.options));
  }

  private static configurePrettyOptions(
    options: LoggerConfigOptions
  ): pino.LoggerOptions {
    return {
      enabled: options.enabled,
      level: options.level,
      redact: ['req.authorization', 'password'],
      transport: {
        target: 'pino-pretty',
        options: {
          levelFirst: true,
          singleLine: true,
          messageFormat:
            '{hostname} {correlationKey} [{context}] - {msg} - {stackTrace}',
        },
      },
    };
  }

  create(context?: string): pino.Logger {
    if (context) return this.logger.child({ context });
    return this.logger.child({});
  }
}
