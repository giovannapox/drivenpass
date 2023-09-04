import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:"If the body is incomplete"
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:"When the user tries to use a title in the note that is already in use"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:"Successfully registered note"
  })
  @ApiOperation({summary:"Note creation", description:"this request serves to create a note for the user"})
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    const userId = req.user.id;
    return await this.notesService.create(createNoteDto, userId);
  };

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:"No notes found"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:"Notes found and sent to the user"
  })
  @ApiOperation({summary:"Searching for User Notes", description:"this request serves to search and send users their notes"})
  @Get()
  async findAll(@Request() req ) {
    const userId = req.user.id;
    return await this.notesService.findAll(userId);
  };

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:"No note found"
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:"If the user searches for a note that is not theirs"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:"Note found and sent to the user"
  })
  @ApiOperation({summary:"Searching for User Note by id", description:"this request serves to search and send the note of a respective id to the users"})
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.notesService.findOne(Number(id), userId);
  };

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:"No note found"
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:"If the user try to delete a note that is not theirs"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:"Successfully deleted note"
  })
  @ApiOperation({summary:"note deletion by id", description:"this request serves to delete a user's note passed by an id"})
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.notesService.remove(Number(id), userId);
  };
};
