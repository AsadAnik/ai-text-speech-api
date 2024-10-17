import { Module } from '@nestjs/common';
import { ApiGateController } from './api-gate.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'TEXT_VOICE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'text_voice_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [ApiGateController]
})
export class ApiGateModule { }
