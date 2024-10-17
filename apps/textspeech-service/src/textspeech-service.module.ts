import { Module } from '@nestjs/common';
import { TextspeechServiceController } from './textspeech-service.controller';
import { TextspeechServiceService } from './textspeech-service.service';

@Module({
  imports: [],
  controllers: [TextspeechServiceController],
  providers: [TextspeechServiceService],
})
export class TextspeechServiceModule {}
