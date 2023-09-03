import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppRepository } from './app.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {

  constructor(private readonly repository: AppRepository){};

  getHealth(): string {
    return 'I’m okay!';
  }

  async remove(body, userId: number){
    const user = await this.repository.findUserById(userId);
    const password = bcrypt.compare(body.password, user.password);
    if(!password) throw new UnauthorizedException();

    return this.repository.delete(userId);
  }
}
