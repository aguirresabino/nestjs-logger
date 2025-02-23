# NestJS Logger

NestJS Logger is a powerful logging library for NestJS applications, built on top of Pino.

## Features

- Customizable logging levels
- Asynchronous local storage for correlation IDs
- Integration with NestJS
- Support for multiple logger contexts

## Installation

To install the library, use the following command:

```sh
npm install @aguirresabino/nestjs-logger
```
or with Yarn:

```sh
yarn add @aguirresabino/nestjs-logger
```

## Usage

### Basic Usage

To use the logger in your NestJS application, you can import and configure the `LoggerModule` using either `forRoot`, `forRootAsync` with `useFactory`, or `forRootAsync` with `useClass`:

#### Using `forRoot`

```ts
import { Module } from '@nestjs/common';
import { LoggerModule } from '@aguirresabino/nestjs-logger';

@Module({
  imports: [
    LoggerModule.forRoot({
      pino: {
        enabled: true,
        level: 'info',
      }
    }),
  ],
})
export class AppModule {}
```

#### Using `forRootAsync` with `useFactory`

```ts
import { Module } from '@nestjs/common';
import { LoggerModule } from '@aguirresabino/nestjs-logger';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: () => ({
        pino: {
          enabled: true,
          level: 'info',
        }
      }),
    }),
  ],
})
export class AppModule {}
```

#### Using `forRootAsync` with `useClass`

```ts
import { Module } from '@nestjs/common';
import { LoggerModule, LoggerModuleOptionsFactory, LoggerModuleOptions } from '@aguirresabino/nestjs-logger';

class LoggerConfigService implements LoggerModuleOptionsFactory {
  createLoggerOptions(): LoggerModuleOptions {
    return {
      pino: {
        enabled: true,
        level: 'info',
      }
    };
  }
}

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useClass: LoggerConfigService,
    }),
  ],
})
export class AppModule {}
```

The `AppLogger` class can be used to replace the default NestJS logger. It implements the `LoggerService` interface. To replace the default logger, you can do this:

```ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  AppLoggerFactory,
  DEFAULT_APP_LOGGER
} from '@aguirresabino/nestjs-logger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
    logger: AppLoggerFactory.get(),
  });
  app.useLogger(app.get(DEFAULT_APP_LOGGER));
}
void bootstrap();
```

Now, you can inject a logger into a service or other injectable class using the `@InjectLogger` decorator:

```ts
import { Injectable } from '@nestjs/common';
import { InjectLogger, Logger } from '@aguirresabino/nestjs-logger';

@Injectable()
export class MyService {
  constructor(
    @InjectLogger(MyService.name) private readonly logger: Logger,
  ){}
}
```

### Using the Logger Outside of NestJS

The `AppLogger` class can also be used outside of the NestJS dependency injection context. This can be useful for logging in other parts of your code that do not use NestJS:

```ts
import { AppLoggerFactory } from '@aguirresabino/nestjs-logger';

const logger = AppLoggerFactory.get();

logger.log('This is a log message');
logger.log('This is a log message with context', 'Context');
```

### Hybrid Applications (HTTP and Microservice)

Hybrid applications allow you to combine an HTTP-based NestJS application with microservices in a single application. In such scenarios, it is crucial to enable the `inheritAppConfig` option during the microservice connection. This option ensures that global configuration (such as pipes, interceptors, guards, and filters) from the main HTTP application is shared with the microservice context.

This is especially important when using global interceptors like the [`LoggerLocalAsyncStorageInterceptor`](./src/logger-local-async-storage.interceptor.ts). This interceptor utilizes Node.js's `AsyncLocalStorage` to create a local context (for example, assigning a unique correlation key to each request) that is essential for tracking and logging request-specific data.

For example:

```ts
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

const microservice = app.connectMicroservice<MicroserviceOptions>(
  {
    transport: Transport.TCP,
  },
  { inheritAppConfig: true },
);
```

For a complete hybrid application example using this approach, see our [pino-http-microservice.ts](./examples/pino-http-microservice.ts) example.

## Contributing

Contributions are welcome! Please read our Contributing Guide to learn how you can help.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Changelog

See the CHANGELOG for a history of changes to this project.

## Acknowledgements

This project was inspired by the [nestjs-pino](https://www.npmjs.com/package/nestjs-pino) package.
