import { Test, TestingModule } from '@nestjs/testing';
import { AutopostService } from './autopost.service';

describe('AutopostService', () => {
  let service: AutopostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutopostService],
    }).compile();

    service = module.get<AutopostService>(AutopostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
