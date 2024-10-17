import { Injectable } from '@nestjs/common';

@Injectable()
export class TextspeechServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
