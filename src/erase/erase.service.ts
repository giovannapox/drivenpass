import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateEraseDto } from './dto/create-erase.dto';
import { EraseRepository } from './erase.repository';
import * as bcrypt from "bcrypt";

@Injectable()
export class EraseService {
  constructor(private readonly repository: EraseRepository){};

  async erase(userId: number, body: CreateEraseDto) {
    const { password } = body;
    const user = await this.repository.getById(userId)
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) throw new UnauthorizedException();
    
    return await this.repository.erase(userId);
  }

}
