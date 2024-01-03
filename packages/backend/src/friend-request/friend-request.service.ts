import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from './friend-request.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

export enum Relation {
  none = 'None',
  friend = 'Friend',
  sender = 'Sender',
  receiver = 'Receiver',
}

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private requestRepo: Repository<FriendRequest>,
    private userService: UserService,
  ) {}

  async getRelation(userId: number, otherId: number) {
    const user = await this.userService.findOne(userId);
    const other = await this.userService.findOne(otherId);

    if (!user || !other) {
      throw new ConflictException();
    }

    const from = await this.requestRepo.findOneBy({
      sender: user,
      receiver: other,
    });
    const to = await this.requestRepo.findOneBy({
      sender: other,
      receiver: user,
    });

    if (!from && to) return Relation.receiver;
    if (from && !to) return Relation.sender;
    if (from && to) return Relation.friend;
    return Relation.none;
  }

  async createFriendRequest(userId: number, otherId: number) {
    const user = await this.userService.findOne(userId);
    const other = await this.userService.findOne(otherId);

    if (!user || !other) return;

    const relation = await this.getRelation(userId, otherId);
    if (relation === Relation.friend || relation === Relation.sender) return;
    await this.requestRepo.save({
      sender: user,
      receiver: other,
    });
    return;
  }

  async deleteFriendRequest(userId: number, otherId: number) {
    const user = await this.userService.findOne(userId);
    const other = await this.userService.findOne(otherId);

    if (!user || !other) {
      throw new ConflictException();
    }

    const request = await this.requestRepo.findOneBy({
      sender: user,
      receiver: other,
    });

    if (request)
      return this.requestRepo.delete({
        friendRequestId: request.friendRequestId,
      });

    return;
  }
}
