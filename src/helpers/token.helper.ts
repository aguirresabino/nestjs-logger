/* eslint-disable @typescript-eslint/no-magic-numbers */
import { DEFAULT_APP_LOGGER, LOGGER_SUFFIX } from '../constants';

export function getDefaultLoggerToken(): symbol {
  return DEFAULT_APP_LOGGER;
}

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
