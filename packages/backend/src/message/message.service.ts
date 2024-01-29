import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    private userService: UserService,
  ) {}

  async createMessage(userId: number, toId: number, message: string) {
    const fromUser = await this.userService.findOne(userId);
    const toUser = await this.userService.findOne(toId);
    if (!fromUser || !toUser) {
      throw new NotFoundException();
    }

    return this.messageRepo.save({
      sender: fromUser,
      receiver: toUser,
      message,
      create_at: new Date(),
    });
  }

  async getChat(userId: number, toId: number) {
    const fromUser = await this.userService.findOne(userId);
    const toUser = await this.userService.findOne(toId);
    if (!fromUser || !toUser) {
      throw new NotFoundException();
    }

    const chat = await this.messageRepo.find({
      relations: ['sender'],
      where: [
        { sender: fromUser, receiver: toUser },
        { sender: toUser, receiver: fromUser },
      ],
      select: ['sender'],
      order: {
        create_at: 'ASC',
      },
    });

    return chat.map((item) => {
      return {
        ...item,
        sender: {
          userId: item.sender.userId,
        },
      };
    });
  }

  async getUnreadMessage(userId: number) {
    const user = await this.userService.findOne(userId);
    if(!user) {
      throw new UnauthorizedException();
    }

    const chats = await this.messageRepo.find({
      relations: ['sender', 'receiver'],
      where: [
        {sender: user},
        {receiver: user}
      ],
      select: ['sender', 'receiver'],
    });

    return chats;
  }
}
