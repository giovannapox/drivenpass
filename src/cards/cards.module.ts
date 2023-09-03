import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardsRepository } from './cards.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
  imports: [UsersModule]
})
export class CardsModule {}
