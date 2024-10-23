import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerConfig } from '@app/common';
// import { RmqService } from '@app/common';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // RabbitMQ microservice configuration
  const rabbitMqApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost:5672"], // RabbitMQ connection
        queue: "user_queue", // Queue to listen to
        queueOptions: {
          durable: false, // Non-durable queue
        },
      },
    }
  );

  // Start the RabbitMQ service
  await rabbitMqApp.listen();
  console.log("RabbitMQ User Service is listening...");

  // HTTP server setup (on port 3002)
  const httpApp = await NestFactory.create(UserServiceModule);

  // Set the global prefix for all routes
  httpApp.setGlobalPrefix('api');

  // Setup Swagger for API documentation
  // [http://localhost:3002/api-docs]
  SwaggerConfig.setup(httpApp, 'User Service');

  await httpApp.listen(3002);
  console.log("HTTP server running on http://localhost:3002");
}
bootstrap();
