import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { RmqService } from '@app/common';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // RabbitMQ microservice configuration
  const rabbitMqApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://guest:guest@rabbitmq:5672"], // RabbitMQ connection
        queue: "user_queue", // Queue to listen to
        queueOptions: {
          durable: false, // Non-durable queue
          retryAttempts: 5, // Retry attempts if RabbitMQ connection fails
          retryDelay: 3000, // Retry delay of 3 seconds
        },
      },
    }
  );

  // Start the RabbitMQ service
  await rabbitMqApp.listen();
  console.log("RabbitMQ User Service is listening...");

  // HTTP server setup (on port 3001)
  const httpApp = await NestFactory.create(UserServiceModule);
  await httpApp.listen(3002); // HTTP port
  console.log("HTTP server running on http://localhost:3002");
}
bootstrap();
