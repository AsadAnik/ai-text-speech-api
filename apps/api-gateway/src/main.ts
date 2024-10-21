import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // region Connect Auth-Service
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'auth_queue',
      queueOptions: {
        durable: false,
      },
    }
  });

  // region Connect User-Service
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://localhost:5672'],
  //     queue: 'user_queue',
  //     queueOptions: {
  //       durable: false,
  //     },
  //   },
  // });

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3000);
  console.log('API Gateway is running on port 3000');
}

bootstrap();
