import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCredentialDto } from './dto/create-credential.dto';

@Injectable()
export class CredentialsRepository {
    constructor(private readonly prisma: PrismaService){};

    create(body: CreateCredentialDto, userId: number){
        const Cryptr = require('cryptr');
        const cryptr = new Cryptr(process.env.JWT_SECRET);
        return this.prisma.credentials.create({
            data: {
                UserId: userId,
                Title: body.title,
                Url: body.url,
                Username: body.username,
                Password: cryptr.encrypt(body.password)
            }
        })
    };

    findByTitle(body: CreateCredentialDto, userId: number){
        const { title } = body;
        return this.prisma.credentials.findFirst({
            where: {
                Title: title,
                UserId: userId
            }
        })
    };

    getAll(userId: number){
        return this.prisma.credentials.findMany({
            where: {
                UserId: userId
            }
        })
    };

    getById(id: number){
        return this.prisma.credentials.findFirst({
            where: {
                id
            }
        })
    };

    deleteById(id: number){
        return this.prisma.credentials.delete({
            where: {
                id
            }
        })
    };
}