import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

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
    description:"When the user tries to use a title in the credential that is already in use"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:"Successfully registered credential"
  })
  @ApiOperation({summary:"Credential creation", description:"this request serves to create a credential for the user"})
  @Post()
  async create(@Body() createCredentialDto: CreateCredentialDto, @Request() req) {
    const userId = req.user.id;
    return await this.credentialsService.create(createCredentialDto, userId);
  }
  
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:"No credentials found"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:"Credentials found and sent to the user"
  })
  @ApiOperation({summary:"Searching for User Credentials", description:"this request serves to search and send users their credentials"})
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return await this.credentialsService.findAll(userId);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:"No credential found"
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:"If the user searches for a credential that is not theirs"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:"Credential found and sent to the user"
  })
  @ApiOperation({summary:"Searching for User Credential by id", description:"this request serves to search and send the credential of a respective id to the users"})
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.credentialsService.findOne(Number(id), userId);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:"No credential found"
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:"If the user try to delete a credential that is not theirs"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:"Successfully deleted credential"
  })
  @ApiOperation({summary:"credential deletion by id", description:"this request serves to delete a user's credential passed by an id"})
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.credentialsService.remove(Number(id), userId);
  }
}
