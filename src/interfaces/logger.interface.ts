export interface Logger {
  fatal<T extends object>(data: T, message?: string): void;
  error<T extends object>(data: T, message?: string): void;
  warn<T extends object>(data: T, message?: string): void;
  info<T extends object>(data: T, message?: string): void;
  debug<T extends object>(data: T, message?: string): void;
  trace<T extends object>(data: T, message?: string): void;
}
