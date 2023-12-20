import { Test, TestingModule } from '@nestjs/testing';
import { FishingController } from './fishing.controller';
import { FishingService } from './fishing.service';

describe('FishingController', () => {
  let controller: FishingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FishingController],
      providers: [FishingService],
    }).compile();

    controller = module.get<FishingController>(FishingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
