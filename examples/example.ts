import { Injectable, Module } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';

import {
  AppLoggerFactory,
  getTokenOfLoggerThatOverrideNestLogger,
  InjectLogger,
  Logger,
  LoggerConfigFactory,
  LoggerConfigOptions,
  LoggerModule,
} from '../src';

@Injectable()
export class MyService {
  constructor(@InjectLogger(MyService.name) private readonly logger: Logger) {}

  logMessage(): void {
    this.logger.info({}, 'This is an info log message from MyService');
    this.logger.debug({}, 'This is a debug log message from MyService');
    this.logger.warn({}, 'This is a warn log message from MyService');
    this.logger.error({}, 'This is an error log message from MyService');
    this.logger.fatal({}, 'This is a fatal log message from MyService');
    this.logger.trace({}, 'This is a trace log message from MyService');
    this.logger.info({ userId: 123, action: 'login' }, 'User logged in');
    this.logger.debug(
      { userId: 123, action: 'fetchData' },
      'Fetching user data'
    );
    this.logger.warn(
      { userId: 123, action: 'updateProfile' },
      'User profile update warning'
    );
    this.logger.error(
      { userId: 123, action: 'deleteAccount' },
      'Error deleting user account'
    );
    this.logger.fatal(
      { userId: 123, action: 'systemCrash' },
      'System crash occurred'
    );
    this.logger.trace(
      { userId: 123, action: 'traceAction' },
      'Tracing user action'
    );
  }
}

@Injectable()
export class LoggerConfigService implements LoggerConfigFactory {
  create(): LoggerConfigOptions {
    return {
      enabled: true,
      level: 'debug',
    };
  }
}

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useClass: LoggerConfigService,
    }),
  ],
  providers: [MyService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}

async function bootstrap(): Promise<void> {
  const app: NestApplication = await NestFactory.create<NestApplication>(
    AppModule,
    { abortOnError: false, logger: AppLoggerFactory.get() }
  );
  app.useLogger(app.get(getTokenOfLoggerThatOverrideNestLogger()));
  const myService: MyService = app.get(MyService);
  myService.logMessage();
  await app.close();
}
void bootstrap();
