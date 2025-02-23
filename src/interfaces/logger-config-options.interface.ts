import { LoggerOptions } from 'pino';

export interface LoggerModuleOptions {
  pino?: LoggerOptions;
}

export interface LoggerConfigFactory {
  create(): LoggerModuleOptions | Promise<LoggerModuleOptions>;
}
