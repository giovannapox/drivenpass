import { Test, TestingModule } from '@nestjs/testing';
import { EraseService } from './erase.service';

describe('EraseService', () => {
  let service: EraseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EraseService],
    }).compile();

    service = module.get<EraseService>(EraseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
