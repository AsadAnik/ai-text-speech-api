import { Test, TestingModule } from '@nestjs/testing';
import { TextVoiceService } from './text-voice.service';

describe('TextVoiceService', () => {
  let service: TextVoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextVoiceService],
    }).compile();

    service = module.get<TextVoiceService>(TextVoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
