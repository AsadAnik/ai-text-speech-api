import { NestFactory } from "@nestjs/core";
import { AuthServiceModule } from "./auth-service.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { SwaggerConfig } from "@app/common";

async function bootstrap() {
  // RabbitMQ microservice configuration
  // region Service Connect
  const rabbitMqApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost:5672"], // RabbitMQ connection
        queue: "auth_queue", // Queue to listen to
        queueOptions: {
          durable: false, // Non-durable queue
        },
      },
    }
  );

  // Start the RabbitMQ service
  await rabbitMqApp.listen();
  console.log("RabbitMQ Auth Service is listening...");

  // HTTP server setup (on port 3001)
  const httpApp = await NestFactory.create(AuthServiceModule);

  // Set the global prefix for all routes
  httpApp.setGlobalPrefix('api');

  // Setup Swagger for API documentation
  // [http://localhost:3001/api-docs]
  SwaggerConfig.setup(httpApp, 'Auth Service');

  await httpApp.listen(3001);
  console.log("HTTP server running on http://localhost:3001");
}

bootstrap();
