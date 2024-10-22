import { NestFactory } from "@nestjs/core";
import { TextspeechServiceModule } from "./textspeech-service.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {

  //region RabbitMQ microservice configuration
  const rabbitMqApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    TextspeechServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost:5672"],
        queue: "textspeech_queue",
        queueOptions: {
          durable: false,
          retryAttempts: 5,
          retryDelay: 3000,
        },
      },
    }
  );

  // region rabbitmq service start
  await rabbitMqApp.listen();
  console.log("RabbitMQ Textspeech Service is listening...");

  // region http server start
  const httpApp = await NestFactory.create(TextspeechServiceModule);
  await httpApp.listen(3003);
}
bootstrap();
