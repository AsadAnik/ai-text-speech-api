import { NestFactory } from '@nestjs/core';
import { TextspeechServiceModule } from './textspeech-service.module';

async function bootstrap() {
  const app = await NestFactory.create(TextspeechServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
