import { Module } from '@nestjs/common';
import { TextVoiceService } from './text-voice.service';
import { TextVoiceController } from './text-voice.controller';

@Module({
  providers: [TextVoiceService],
  controllers: [TextVoiceController]
})
export class TextVoiceModule {}
