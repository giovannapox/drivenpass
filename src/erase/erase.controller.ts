import { Controller, Post, Body, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { EraseService } from './erase.service';
import { CreateEraseDto } from './dto/create-erase.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('erase')
@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}
  
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:"credentials, notes, cards and user registration successfully deleted"
  })
  @ApiOperation({summary:"deletion of all user information", description:"this request serves to delete credentials, notes, cards and user registration"})
  @Post()
  async erase(@Body() createEraseDto: CreateEraseDto, @Request() req) {
    const userId = req.user.id;
    return await this.eraseService.erase(userId, createEraseDto);
  }
}
