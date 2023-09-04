import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {};

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
    description:"When the user tries to use a title in the card that is already in use"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:"Successfully registered card"
  })
  @ApiOperation({summary:"Card creation", description:"this request serves to create a card for the user"})
  @Post()
  async create(@Body() createCardDto: CreateCardDto, @Request() req) {
    const userId = req.user.id;
    return await this.cardsService.create(createCardDto, userId);
  };

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:"No card found"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:"Card found and sent to the user"
  })
  @ApiOperation({summary:"Searching for User Cards", description:"this request serves to search and send users their Cards"})
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return await this.cardsService.findAll(userId);
  };

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:"No card found"
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:"If the user searches for a card that is not theirs"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:"Card found and sent to the user"
  })
  @ApiOperation({summary:"Searching for User Card by id", description:"this request serves to search and send the card of a respective id to the users"})
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.cardsService.findOne(Number(id), userId);
  };

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:"No card found"
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:"If the user try to delete a card that is not theirs"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:"Successfully deleted card"
  })
  @ApiOperation({summary:"card deletion by id", description:"this request serves to delete a user's card passed by an id"})
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.cardsService.remove(Number(id), userId);
  };
  
};
