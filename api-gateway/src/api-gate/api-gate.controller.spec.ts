import { Test, TestingModule } from '@nestjs/testing';
import { ApiGateController } from './api-gate.controller';

describe('ApiGateController', () => {
  let controller: ApiGateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiGateController],
    }).compile();

    controller = module.get<ApiGateController>(ApiGateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
