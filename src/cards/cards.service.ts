import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';

@Injectable()
export class CardsService {

  constructor(private readonly repository: CardsRepository){};

  async create(createCardDto: CreateCardDto, userId: number) {
    const title = await this.repository.findByTitle(createCardDto, userId);
    if(title) throw new ConflictException();

    return await this.repository.create(createCardDto, userId);
  };

  async findAll(userId: number) {
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    const cards = await this.repository.getAll(userId);
    if(!cards) throw new NotFoundException();
    const cardsDecrypted = cards.map((c) => ({
      ...c,
      Cvv: cryptr.decrypt(c.Cvv),
      Password: cryptr.decrypt(c.Password)
    }));

    return cardsDecrypted;
  };

  async findOne(id: number, userId: number) {
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    const card = await this.repository.getById(id);
    if(!card) throw new NotFoundException();
    if(card.UserId !== userId) throw new ForbiddenException();
    const passwordDescrypted = cryptr.decrypt(card.Password);
    const cvvDescrypted = cryptr.decrypt(card.Cvv);
    card.Password = passwordDescrypted;
    card.Cvv = cvvDescrypted;

    return card;
  };


  async remove(id: number, userId: number) {
    const card = await this.repository.getById(id);
    if(!card) throw new NotFoundException()
    if(card.UserId !== userId) throw new ForbiddenException()
    
    return await this.repository.delete(id);
  };
};