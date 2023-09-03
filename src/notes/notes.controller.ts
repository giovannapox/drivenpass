import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    const userId = req.user.id;
    return await this.notesService.create(createNoteDto, userId);
  };

  @Get()
  async findAll(@Request() req ) {
    const userId = req.user.id;
    return await this.notesService.findAll(userId);
  };

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.notesService.findOne(Number(id), userId);
  };

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.notesService.remove(Number(id), userId);
  };
};
