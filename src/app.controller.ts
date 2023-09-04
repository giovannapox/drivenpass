import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('helth')
  @Get("health")
  @ApiResponse({
    status:HttpStatus.OK,
    description:"I'm Okay"
  })
  @ApiOperation({summary:"Checks APIs health", description:"this request serves to check if API works"})
  @HttpCode(HttpStatus.OK)
  getHealth(): string {
    return this.appService.getHealth();
  };
}
