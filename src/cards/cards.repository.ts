import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsRepository {
    constructor(private readonly prisma: PrismaService){};

    create(body: CreateCardDto, userId: number){
        const Cryptr = require('cryptr');
        const cryptr = new Cryptr(process.env.JWT_SECRET);
        return this.prisma.cards.create({
            data: {
                Number: body.number,
                Name: body.name,
                Cvv: cryptr.encrypt(body.cvv),
                Date: body.date,
                Password: cryptr.encrypt(body.password),
                Virtual: body.virtual,
                Type: body.type,
                Title: body.title,
                UserId: userId
            }
        })
    };

    findByTitle(body: CreateCardDto, userId: number){
        const { title } = body;
        return this.prisma.cards.findFirst({
            where: {
                Title: title,
                UserId: userId
            }
        })
    };

    getAll(userId: number){
        return this.prisma.cards.findMany({
            where: {
                UserId: userId
            }
        })
    };

    getById(id: number){
        return this.prisma.cards.findFirst({
            where: {
                id
            }
        })
    };

    delete(id: number){
        return this.prisma.cards.delete({
            where: {
                id
            }
        })
    };
};