import { Controller, Get, Logger, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import {
  AppLoggerFactory,
  DEFAULT_APP_LOGGER,
  LoggerModule,
  LoggerModuleOptions,
  LoggerModuleOptionsFactory,
} from '../src';

@Controller()
export class AppController {
  // curl -X GET http://localhost:3000/hello
  // curl -X GET http://localhost:3000/hello -H "x-request-id: 123"
  @Get('hello')
  getHello(): Record<string, string> {
    return { message: 'Hello World' };
  }
}

export class LoggerConfigService implements LoggerModuleOptionsFactory {
  create(): LoggerModuleOptions {
    return {
      pino: {
        enabled: true,
        level: 'debug',
      },
      enableHttpLogging: true, // Enable HTTP logging
    };
  }
}

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useClass: LoggerConfigService,
    }),
  ],
  controllers: [AppController],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    logger: AppLoggerFactory.get(),
  });
  app.useLogger(app.get(DEFAULT_APP_LOGGER));
  const logger = app.get<Logger>(DEFAULT_APP_LOGGER);
  const serverPort = 3000;
  await app.listen(serverPort);
  logger.log(
    'Application is running on: http://localhost:3000/hello',
    'bootstrap'
  );
}
void bootstrap();
