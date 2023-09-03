import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {};

  @Post()
  async create(@Body() createCardDto: CreateCardDto, @Request() req) {
    const userId = req.user.id;
    return await this.cardsService.create(createCardDto, userId);
  };

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return await this.cardsService.findAll(userId);
  };

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.cardsService.findOne(Number(id), userId);
  };

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.cardsService.remove(Number(id), userId);
  };
  
};
