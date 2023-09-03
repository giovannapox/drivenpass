import { Controller, Body, Get, HttpCode, HttpStatus, Post, Request} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  @HttpCode(HttpStatus.OK)
  getHealth(): string {
    return this.appService.getHealth();
  };

  @Post('erase')
  async remove(@Body() body, @Request() req) {
    const userId = req.user.id;
    return await this.appService.remove(body, userId);
  };
}
