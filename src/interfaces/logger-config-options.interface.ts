import { LoggerOptions } from 'pino';

export interface LoggerModuleOptions {
  pino?: LoggerOptions;
}

export interface LoggerModuleOptionsFactory {
  create(): LoggerModuleOptions | Promise<LoggerModuleOptions>;
}
