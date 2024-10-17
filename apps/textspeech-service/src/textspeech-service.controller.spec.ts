import { Test, TestingModule } from '@nestjs/testing';
import { TextspeechServiceController } from './textspeech-service.controller';
import { TextspeechServiceService } from './textspeech-service.service';

describe('TextspeechServiceController', () => {
  let textspeechServiceController: TextspeechServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TextspeechServiceController],
      providers: [TextspeechServiceService],
    }).compile();

    textspeechServiceController = app.get<TextspeechServiceController>(TextspeechServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(textspeechServiceController.getHello()).toBe('Hello World!');
    });
  });
});
