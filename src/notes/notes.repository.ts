import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesRepository {
    constructor(private readonly prisma: PrismaService){};

    create(body: CreateNoteDto, userId: number){
        return this.prisma.notes.create({
            data: {
                UserId: userId,
                Title: body.title,
                Text: body.text
            }
        })
    };

    findByTitle(body: CreateNoteDto, userId: number){
        const { title } = body;
        return this.prisma.notes.findFirst({
            where: {
                Title: title,
                UserId: userId
            }
        })
    };

    getAllNotes(userId: number){
        return this.prisma.notes.findMany({
            where: {
                UserId: userId
            }
        })
    };

    getById(id: number){
        return this.prisma.notes.findFirst({
            where: {
                id
            }
        })
    };

    delete(id: number){
        return this.prisma.notes.findFirst({
            where: {
                id
            }
        })
    };
};