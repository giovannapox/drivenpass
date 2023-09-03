import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  async create(@Body() createCredentialDto: CreateCredentialDto, @Request() req) {
    const userId = req.user.id;
    return await this.credentialsService.create(createCredentialDto, userId);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return await this.credentialsService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.credentialsService.findOne(Number(id), userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.credentialsService.remove(Number(id), userId);
  }
}
