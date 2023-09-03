import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';

@Injectable()
export class CredentialsService {

  constructor(private readonly repository: CredentialsRepository){};

  async create(createCredentialDto: CreateCredentialDto, userId: number) {
    const title = await this.repository.findByTitle(createCredentialDto, userId);
    if(title) throw new ConflictException();

    return await this.repository.create(createCredentialDto, userId);
  };

  async findAll(userId: number) {
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    const credentials = await this.repository.getAll(userId);
    if(!credentials) throw new NotFoundException();
    const credentialsDecrypted = credentials.map((c) => ({
      ...c,
      Password: cryptr.decrypt(c.Password)
    }));

    return credentialsDecrypted;
  };

  async findOne(id: number, userId: number) {
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    const credential = await this.repository.getById(id);
    if(!credential) throw new NotFoundException();
    if(credential.UserId !== userId) throw new ForbiddenException();
    const passwordDescrypted = cryptr.decrypt(credential.Password);
    credential.Password = passwordDescrypted;

    return credential;
  };

  async remove(id: number, userId: number) {
    const credential = await this.repository.getById(id);
    if(!credential) throw new NotFoundException()
    if(credential.UserId !== userId) throw new ForbiddenException()
    
    return await this.repository.deleteById(id);
  }
}
