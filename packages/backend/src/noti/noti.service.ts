import { InjectRepository } from '@nestjs/typeorm';
import { Noti } from './noti.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NotiDto } from './dto/noti.dto';
import { UserService } from 'src/user/user.service';
import {
  FriendRequestService,
  Relation,
} from 'src/friend-request/friend-request.service';
import { PaginationOptions } from 'src/utils/constants';

enum NotiType {
  send = 'has sent you a friend request',
  receive = 'has accepted your friend request'
}

@Injectable()
export class NotiService {
  constructor(
    @InjectRepository(Noti) private notiRepo: Repository<Noti>,
    private userService: UserService,
    private friendRequestService: FriendRequestService,
  ) {}

  async getAllNoti(userId: number, pagOpts: PaginationOptions) {
    const { page, pageSize } = pagOpts;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }
    const [notis, totalItems] = await this.notiRepo
      .createQueryBuilder('noti')
      .leftJoin('noti.user', 'user')
      .where('noti.user.userId = :userId', { userId })
      .addSelect('user.userId')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { notis, total: totalItems };
  }

  async hasNoti(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }
    const unreadNoti = await this.notiRepo.findBy({
      user,
      isRead: false,
    });
    if (unreadNoti.length) return true;
    return false;
  }

  async readNoti(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return this.notiRepo.update({ user }, { isRead: true });
  }

  async createNoti(notiData: NotiDto) {
    const user = await this.userService.findOne(notiData.userId);
    if (!user) {
      throw new NotFoundException();
    }
    return this.notiRepo.save({ content: notiData.content, user });
  }

  async createRequest(senderId: number, receiverId: number) {
    const sender = await this.userService.findOne(senderId);
    const receiver = await this.userService.findOne(receiverId);
    if (!sender || !receiver) {
      throw new NotFoundException();
    }
    const relation = await this.friendRequestService.getRelation(
      senderId,
      receiverId,
    );
    if (relation === Relation.none) {
      await this.createNoti({
        content: `${sender.name} ${sender.userId} ` + NotiType.send,
        userId: receiver.userId,
      });
      return { message: 'Send' };
    }
    if (relation === Relation.receiver) {
      await this.createNoti({
        content: `${sender.name} ${sender.userId} ` + NotiType.receive,
        userId: receiver.userId,
      });
      return { message: 'Send' };
    }
    if (relation === Relation.sender) {
      return { message: 'Do nothing' };
    }
    if (relation === Relation.friend) {
      return { message: 'Do nothing' };
    }
    return { message: 'Do nothing' };
  }
}
