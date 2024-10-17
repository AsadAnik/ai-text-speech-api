import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextVoiceModule } from './text-voice/text-voice.module';

@Module({
  imports: [TextVoiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
