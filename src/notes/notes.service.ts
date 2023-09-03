import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private readonly repository: NotesRepository){}

  async create(createNoteDto: CreateNoteDto, userId: number) {
    const title = await this.repository.findByTitle(createNoteDto, userId);
    if(title) throw new ConflictException();

    return await this.repository.create(createNoteDto, userId);
  };

  async findAll(userId: number) {
    const notes = await this.repository.getAllNotes(userId);
    if(!notes) throw new NotFoundException();

    return notes;
  };

  async findOne(id: number, userId: number) {
    const notes = await this.repository.getById(id);
    if(!notes) throw new NotFoundException();
    if(notes.UserId !== userId) throw new ForbiddenException();

    return notes;
  };

  async remove(id: number, userId: number) {
    const notes = await this.repository.getById(id);
    if(!notes) throw new NotFoundException();
    if(notes.UserId !== userId) throw new ForbiddenException();
    
    return await this.repository.delete(id);
  };
};
