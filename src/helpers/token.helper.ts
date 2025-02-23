/* eslint-disable @typescript-eslint/no-magic-numbers */
import { LOGGER_SUFFIX } from '../constants';

export const LOGGER_OPTIONS = Symbol('LoggerOptions');
export const LOGGER_LOCAL_ASYNC_STORAGE = Symbol('LoggerLocalAsyncStorage');
export const DEFAULT_APP_LOGGER = Symbol('DefaultAppLogger');

export function getLoggerToken(context: string): string {
  const suffix: string = context.slice(-1 * LOGGER_SUFFIX.length);
  if (suffix === LOGGER_SUFFIX) return context;
  return `${context}${LOGGER_SUFFIX}`;
}

export function getContextFromLoggerToken(token: string): string {
  const regex = /(.+)Logger(?!.*Logger)/;
  const match: string[] | null = token.match(regex);

  return match ? match[1] : token;
}
