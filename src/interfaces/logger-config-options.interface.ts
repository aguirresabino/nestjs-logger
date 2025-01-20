import { LoggerOptions } from 'pino';

export interface LoggerConfigOptions {
  pino: LoggerOptions;
}

export interface LoggerConfigFactory {
  create(): LoggerConfigOptions | Promise<LoggerConfigOptions>;
}
