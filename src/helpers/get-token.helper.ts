/* eslint-disable @typescript-eslint/no-magic-numbers */
import { DEFAULT_APP_LOGGER, LOGGER_SUFFIX } from '../constants';

export function getTokenOfLoggerThatOverrideNestLogger(): symbol {
  return DEFAULT_APP_LOGGER;
}

export function getLoggerToken(context: string): string {
  const suffix: string = context.slice(-1 * LOGGER_SUFFIX.length);
  if (suffix === LOGGER_SUFFIX) return context;
  return `${context}${LOGGER_SUFFIX}`;
}
