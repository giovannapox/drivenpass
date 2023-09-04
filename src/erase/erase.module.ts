import { Module } from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseController } from './erase.controller';
import { EraseRepository } from './erase.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [EraseController],
  providers: [EraseService, EraseRepository],
  imports: [UsersModule]
})
export class EraseModule {}
