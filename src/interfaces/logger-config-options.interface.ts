export interface LoggerConfigOptions {
  enabled: boolean;
  level: string;
}

export interface LoggerConfigFactory {
  createLoggerOptions(): LoggerConfigOptions | Promise<LoggerConfigOptions>;
}
