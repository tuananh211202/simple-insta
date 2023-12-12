import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AppDto } from './dto/app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@Body() body: AppDto): string {
    return this.appService.getHello(body.name);
  }
}
