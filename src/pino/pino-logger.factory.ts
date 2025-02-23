import pino from 'pino';

import { Inject, Injectable } from '@nestjs/common';

import { LOGGER_OPTIONS } from '../helpers';
import { LoggerModuleOptions } from '../interfaces';
import { PINO_LOGGER_OPTIONS_DEFAULT } from './pino-logger-options-default.const';

@Injectable()
export class PinoLoggerFactory {
  private readonly logger: pino.Logger;

  constructor(
    @Inject(LOGGER_OPTIONS) private readonly options: LoggerModuleOptions
  ) {
    this.logger = pino(this.getOptions());
  }

  private getOptions(): pino.LoggerOptions {
    return this.options?.pino ? this.options.pino : PINO_LOGGER_OPTIONS_DEFAULT;
  }

  create(context?: string): pino.Logger {
    if (context) return this.logger.child({ context });
    return this.logger.child({});
  }
}
