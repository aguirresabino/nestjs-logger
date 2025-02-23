/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { lastValueFrom } from 'rxjs';

import { Controller, Logger, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ClientProxy,
  ClientProxyFactory,
  MessagePattern,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

import {
  AppLoggerFactory,
  Logger as CustomLogger,
  DEFAULT_APP_LOGGER,
  InjectLogger,
  LoggerModule,
  LoggerModuleOptions,
  LoggerModuleOptionsFactory,
} from '../src';

@Controller()
export class MicroserviceController {
  constructor(
    @InjectLogger(MicroserviceController.name)
    private readonly logger: CustomLogger
  ) {}

  @MessagePattern({ cmd: 'ping' })
  ping(data: unknown): string {
    this.logger.debug({ data }, 'Received ping command');
    return 'pong';
  }
}

export class LoggerConfigService implements LoggerModuleOptionsFactory {
  create(): LoggerModuleOptions {
    return {
      pino: {
        enabled: true,
        level: 'debug',
      },
    };
  }
}

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useClass: LoggerConfigService,
    }),
  ],
  controllers: [MicroserviceController],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class MicroserviceAppModule {}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroserviceAppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8877,
      },
    }
  );
  app.useLogger(AppLoggerFactory.get());
  await app.listen();
  const logger = app.get<Logger>(DEFAULT_APP_LOGGER);
  logger.log('Microservice is listening on TCP 127.0.0.1:8877', 'bootstrap');

  // Create a client to test the microservice
  const client: ClientProxy = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: { host: '127.0.0.1', port: 8877 },
  });

  try {
    // Send a test "ping" command and wait for the response
    const response = await lastValueFrom(client.send({ cmd: 'ping' }, {}));
    logger.log(`Test Response: ${JSON.stringify(response, null, 4)}`, 'test');
  } catch (err: any) {
    logger.error(`Test Error: ${err.message || err}`, 'test');
  } finally {
    await client.close();
    await app.close();
  }
}
void bootstrap();
