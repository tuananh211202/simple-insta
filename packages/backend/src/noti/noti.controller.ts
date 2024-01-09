import {
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { NotiService } from './noti.service';

@Controller('noti')
export class NotiController {
  constructor(private notiService: NotiService) {}

  @Get()
  async hasUnreadNoti(@Request() req) {
    return this.notiService.hasNoti(req.user.sub);
  }

  @Post()
  async readNoti(@Request() req) {
    return this.notiService.readNoti(req.user.sub);
  }

  @Get('all')
  async getAllNoti(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 10,
    @Request() req,
  ) {
    return this.notiService.getAllNoti(req.user.sub, { page, pageSize });
  }
}
