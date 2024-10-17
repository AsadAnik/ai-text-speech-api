import { Controller, Get } from '@nestjs/common';
import { TextspeechServiceService } from './textspeech-service.service';

@Controller()
export class TextspeechServiceController {
  constructor(private readonly textspeechServiceService: TextspeechServiceService) {}

  @Get()
  getHello(): string {
    return this.textspeechServiceService.getHello();
  }
}
