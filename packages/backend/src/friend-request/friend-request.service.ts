import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  async getListFriend(userId: number) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const sentRequests = await this.requestRepo.find({
      relations: ['receiver'],
      select: ['receiver'],
      where: {
        sender: user,
      },
    });

    const receivedRequests = await this.requestRepo.find({
      relations: ['sender'],
      select: ['sender'],
      where: {
        receiver: user,
      },
    });

    const listFriend = sentRequests.reduce((result, sentRequest) => {
      if (
        receivedRequests.findIndex(
          (receivedRequest) =>
            receivedRequest.sender.userId === sentRequest.receiver.userId,
        ) !== -1
      )
        return [
          ...result,
          {
            userId: sentRequest.receiver.userId,
            name: sentRequest.receiver.name,
            avatar: sentRequest.receiver.avatar,
          },
        ];
      return result;
    }, []);

    return listFriend;
  }
}
