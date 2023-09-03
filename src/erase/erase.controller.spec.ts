import { Test, TestingModule } from '@nestjs/testing';
import { EraseController } from './erase.controller';
import { EraseService } from './erase.service';

describe('EraseController', () => {
  let controller: EraseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EraseController],
      providers: [EraseService],
    }).compile();

    controller = module.get<EraseController>(EraseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
