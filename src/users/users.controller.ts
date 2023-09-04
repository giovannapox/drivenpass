import { Controller, Post, Body, HttpStatus} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:"If the email is already in use, the application cannot create the account"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:"If the body is incomplete"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:"Successfully registered user"
  })
  @ApiOperation({summary:"User account creation", description:"this request serves to create an account for the user"})
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:"If user is not logged in/invalid token"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:"User logged in successfully"
  })
  @ApiOperation({summary:"User Access", description:"this request serves to login the user"})
  @Post('signin')
  async signin(@Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto);
  }
  
}
