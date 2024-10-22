import { Module } from '@nestjs/common';
import { TextspeechServiceController } from './textspeech-service.controller';
import { TextspeechServiceService } from './textspeech-service.service';
import { RmqModule, DatabaseModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_SPEECH_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/textspeech-service/.env',
    }),
    RmqModule,
    TypeOrmModule.forFeature([]),
    DatabaseModule,
  ],
  controllers: [TextspeechServiceController],
  providers: [TextspeechServiceService],
})
export class TextspeechServiceModule {}
