export interface LoggerConfigOptions {
  enabled: boolean;
  level: string;
}

export interface LoggerConfigFactory {
  create(): LoggerConfigOptions | Promise<LoggerConfigOptions>;
}
