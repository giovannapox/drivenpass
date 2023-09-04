import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EraseRepository {
    constructor(private readonly prisma: PrismaService){};

    erase(userId:number){
        this.prisma.cards.deleteMany({
            where:{
                UserId:userId
            }
        })
        this.prisma.credentials.deleteMany({
            where:{
                UserId:userId
            }
        })
        this.prisma.notes.deleteMany({
            where:{
                UserId:userId
            }
        })
        this.prisma.users.delete({
            where:{
                id:userId
            }
        })
    }

    getById(userId: number){
        return this.prisma.users.findFirst({
            where: {
                id: userId
            }
        })
    }
}