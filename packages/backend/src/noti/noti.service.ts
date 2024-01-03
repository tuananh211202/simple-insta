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
      await this.friendRequestService.createFriendRequest(senderId, receiverId);
      return this.createNoti({
        content: `${sender.name} ${sender.userId} ` + NotiType.send,
        userId: receiver.userId,
      });
    }
    if (relation === Relation.receiver) {
      await this.friendRequestService.createFriendRequest(senderId, receiverId);
      return this.createNoti({
        content: `${sender.name} ${sender.userId} ` + NotiType.receive,
        userId: receiver.userId,
      });
    }
    if (relation === Relation.sender) {
      await this.friendRequestService.deleteFriendRequest(senderId, receiverId);
      return;
    }
    if (relation === Relation.friend) {
      await this.friendRequestService.deleteFriendRequest(senderId, receiverId);
      await this.friendRequestService.deleteFriendRequest(receiverId, senderId);
      return;
    }
    return;
  }
}
