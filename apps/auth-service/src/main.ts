import { NestFactory } from "@nestjs/core";
import { AuthServiceModule } from "./auth-service.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  // RabbitMQ microservice configuration
  const rabbitMqApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost:5672"], // RabbitMQ connection
        queue: "auth_queue", // Queue to listen to
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
  console.log("RabbitMQ Auth Service is listening...");

  // HTTP server setup (on port 3001)
  const httpApp = await NestFactory.create(AuthServiceModule);
  await httpApp.listen(3001); // HTTP port
  console.log("HTTP server running on http://localhost:3001");
}

bootstrap();
