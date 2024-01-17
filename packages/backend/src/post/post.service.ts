import { Injectable, NotFoundException } from '@nestjs/common';
import { ModeType, Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PostDto } from './dto/post.dto';
import { UserService } from 'src/user/user.service';
import { PaginationOptions } from 'src/utils/constants';
import { FriendRequestService } from 'src/friend-request/friend-request.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    private userService: UserService,
    private friendRequestService: FriendRequestService,
  ) {}

  async findOne(postId: number) {
    return this.postRepo.findOneBy({ postId });
  }

  async createPost(userId: number, postDetail: PostDto) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }

    await this.postRepo.save({
      owner: user,
      create_at: new Date(),
      ...postDetail,
    });

    return;
  }

  async getList(userId: number, pagOpts: PaginationOptions) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }

    const { page, pageSize } = pagOpts;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const list = await this.postRepo.find({
      relations: ['comments', 'reacts'],
      where: { owner: user },
      order: { create_at: 'DESC' },
      skip,
      take,
      select: ['comments', 'reacts'],
    });
    return list;
  }

  async getPosts(userId: number, pagOpts: PaginationOptions) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }

    const listFriend = await this.friendRequestService.getListFriend(userId);

    const { page, pageSize } = pagOpts;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const posts = await this.postRepo.find({
      relations: ['comments', 'reacts', 'owner'],
      where: [
        { mode: ModeType.PUBLIC },
        {
          owner: { userId: In(listFriend.map((friend) => friend.userId)) },
          mode: ModeType.NORMAL,
        },
      ],
      order: { create_at: 'DESC' },
      skip,
      take,
      select: ['comments', 'reacts', 'owner'],
    });

    return posts.map((post) => ({
      ...post,
      owner: {
        userId: post.owner.userId,
        name: post.owner.name,
        avatar: post.owner.avatar,
      },
    }));
  }
}
