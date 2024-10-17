import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Connect to Auth Service (via RabbitMQ)
  // region Auth Service
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'auth_queue',
      queueOptions: {
        durable: false,
      },

      // Add a timeout here (in milliseconds)
      socketOptions: {
        heartbeat: 60, // Keep the connection alive with a 60-second heartbeat
      },
    },
  });

  // Connect to User Service (via RabbitMQ)
  // region User Service
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'user_queue',
      queueOptions: {
        durable: false,
      },

      // Add a timeout here (in milliseconds)
      socketOptions: {
        heartbeat: 60, // Keep the connection alive with a 60-second heartbeat
      },
    },
  });

  // Connect to Text-Voice Service (via RabbitMQ)
  // region Text-Voice Service
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'text_voice_queue',
      queueOptions: {
        durable: false,
      },

      // Add a timeout here (in milliseconds)
      socketOptions: {
        heartbeat: 120, // Keep the connection alive with a 60-second heartbeat
      },
    },
  });

  // Start all services..
  // region Start All Services
  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('API Gateway is running on http://localhost:3000');
}
bootstrap();
