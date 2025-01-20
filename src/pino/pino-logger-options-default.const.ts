import pino from 'pino';

export const PINO_LOGGER_OPTIONS_DEFAULT: pino.LoggerOptions = {
  enabled: true,
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      levelFirst: true,
      singleLine: true,
      messageFormat:
        '{hostname} {correlationKey} [{context}] - {msg} - {stackTrace}',
    },
  },
};
