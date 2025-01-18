import { Inject } from '@nestjs/common';

import { getLoggerToken } from './helpers';

export const loggerTokens: Set<string> = new Set<string>();

export function InjectLogger(
  context: string
): PropertyDecorator & ParameterDecorator {
  const token: string = getLoggerToken(context);
  loggerTokens.add(token);
  return Inject(token);
}
