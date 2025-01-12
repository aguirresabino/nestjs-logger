/* eslint-disable @typescript-eslint/no-magic-numbers */

export function getContextFromLoggerToken(token: string): string {
  const regex = /(.+)Logger(?!.*Logger)/;
  const match: string[] | null = token.match(regex);

  return match ? match[1] : token;
}
