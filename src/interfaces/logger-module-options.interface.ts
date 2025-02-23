import { LoggerOptions } from 'pino';

export interface LoggerModuleOptions {
  pino?: LoggerOptions;
  enableHttpLogging?: boolean;
}

export interface LoggerModuleOptionsFactory {
  create(): LoggerModuleOptions | Promise<LoggerModuleOptions>;
}
