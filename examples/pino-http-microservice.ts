/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { lastValueFrom } from 'rxjs';

import { Body, Controller, Inject, Logger, Module, Post } from '@nestjs/common';
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

//
// Microservice Section
//
@Controller()
export class MicroserviceController {
  constructor(
    @InjectLogger(MicroserviceController.name)
    private readonly logger: CustomLogger
  ) {}

  @MessagePattern({ cmd: 'ping' })
  ping(data: unknown): string {
    this.logger.debug({ data }, 'Microservice received ping command');
    return 'pong';
  }
}

//
// HTTP Section
//
@Controller()
export class HybridHttpController {
  constructor(
    @Inject('HYP_CLIENT') private readonly client: ClientProxy,
    @InjectLogger(HybridHttpController.name)
    private readonly logger: CustomLogger
  ) {}

  // curl -X POST http://localhost:3000/publish -H "Content-Type: application/json" -d '{"example": "data"}'
  // curl -X POST http://localhost:3000/publish -H "Content-Type: application/json" -H "x-request-id: 123" -d '{"example": "data"}'
  @Post('publish')
  async publish(
    @Body() payload: Record<string, any>
  ): Promise<Record<string, any>> {
    this.logger.debug({ payload }, 'HTTP publish endpoint called');
    await this.client.connect();
    try {
      const response = await lastValueFrom(
        this.client.send({ cmd: 'ping' }, payload)
      );
      return { status: 'success', response };
    } catch (err: any) {
      this.logger.error({}, `Error sending message: ${err.message || err}`);
      return { status: 'error', message: err.message || err };
    }
  }
}

export class LoggerConfigService implements LoggerModuleOptionsFactory {
  create(): LoggerModuleOptions {
    return {
      pino: {
        enabled: true,
        level: 'debug',
      },
      enableHttpLogging: true,
    };
  }
}

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useClass: LoggerConfigService,
    }),
  ],
  controllers: [HybridHttpController, MicroserviceController],
  providers: [
    {
      provide: 'HYP_CLIENT',
      useFactory: (): ClientProxy => {
        const client: ClientProxy = ClientProxyFactory.create({
          transport: Transport.TCP,
          options: { host: '127.0.0.1', port: 8877 },
        });
        return client;
      },
    },
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class HybridAppModule {}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(HybridAppModule, {
    abortOnError: false,
    logger: AppLoggerFactory.get(),
  });

  // Connect the microservice part (TCP transport)
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 8877 },
    },
    { inheritAppConfig: true }
  );
  await app.startAllMicroservices();

  app.useLogger(AppLoggerFactory.get());
  await app.listen(3000);
  const logger = app.get<Logger>(DEFAULT_APP_LOGGER);
  logger.log(
    'Hybrid application is running on HTTP: http://localhost:3000 and Microservice TCP:127.0.0.1:8877',
    'bootstrap'
  );
}
void bootstrap();
