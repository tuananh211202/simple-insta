import { Injectable, NotFoundException } from '@nestjs/common';
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
}
