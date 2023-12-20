import { Test, TestingModule } from '@nestjs/testing';
import { FishingService } from './fishing.service';

describe('FishingService', () => {
  let service: FishingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FishingService],
    }).compile();

    service = module.get<FishingService>(FishingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
