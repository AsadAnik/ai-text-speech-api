import { NestFactory } from "@nestjs/core";
import { AuthServiceModule } from "./auth-service.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { SwaggerConfig } from "@app/common";
import { ConfigService } from '@nestjs/config';

// Configuration Service 
const configService = new ConfigService();

// Bootstrap the application
async function bootstrap() {
  // RabbitMQ microservice configuration
  const rabbitMQURL = configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672';

  // region Service Connect
  const rabbitMqApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMQURL], // RabbitMQ connection
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

  // Server Endpoint Create
  // [http://localhost:3001]
  const host = configService.get<string>('AUTH_SERVICE_HOST') || 'localhost';
  const port = configService.get<string>('AUTH_SERVICE_PORT') || 3001;

  // HTTP server setup (on port 3001)
  const httpApp = await NestFactory.create(AuthServiceModule);

  // Set the global prefix for all routes
  httpApp.setGlobalPrefix('api');

  // Setup Swagger for API documentation
  // [http://localhost:3001/api-docs]
  SwaggerConfig.setup(httpApp, 'Auth Service');

  await httpApp.listen(port, host);
  const authServiceUrl = `${configService.get<string>('AUTH_SERVICE_PROTOCOL')}://${host}:${port}`;
  console.log(`HTTP server running on ${authServiceUrl}`);
}

bootstrap();
