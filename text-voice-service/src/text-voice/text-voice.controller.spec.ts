import { Test, TestingModule } from '@nestjs/testing';
import { TextVoiceController } from './text-voice.controller';

describe('TextVoiceController', () => {
  let controller: TextVoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextVoiceController],
    }).compile();

    controller = module.get<TextVoiceController>(TextVoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
