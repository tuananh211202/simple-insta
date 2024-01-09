import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get(':id')
  async getChat(@Request() req, @Param('id') userId: number) {
    return this.messageService.getChat(req.user.sub, userId);
  }

  @Post(':id')
  async createMessage(@Request() req, @Param('id') userId, @Body() messDto: { message: string }) {
    return this.messageService.createMessage(req.user.sub, userId, messDto.message);
  }
}
