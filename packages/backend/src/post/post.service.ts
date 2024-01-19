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

  async getList(userId: number, isOwner: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }

    const list = await this.postRepo.find({
      relations: ['comments', 'reacts', 'reacts.owner'],
      where: {
        owner: user,
        mode: In(
          [ModeType.PRIVATE, ModeType.NORMAL, ModeType.PUBLIC].slice(isOwner),
        ),
      },
      order: { create_at: 'DESC' },
      select: ['comments', 'reacts'],
    });

    return list.map((post) => ({
      ...post,
      reacts: post.reacts.map((react) => react.owner.userId),
    }));
  }

  async getPosts(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }

    const listFriend = await this.friendRequestService.getListFriend(userId);

    const posts = await this.postRepo.find({
      relations: ['comments', 'reacts', 'owner', 'reacts.owner'],
      where: [
        { mode: ModeType.PUBLIC },
        {
          owner: { userId: In(listFriend.map((friend) => friend.userId)) },
          mode: ModeType.NORMAL,
        },
      ],
      order: { create_at: 'DESC' },
      select: ['comments', 'reacts', 'owner'],
    });

    return posts.map((post) => ({
      ...post,
      owner: {
        userId: post.owner.userId,
        name: post.owner.name,
        avatar: post.owner.avatar,
      },
      reacts: post.reacts.map((react) => react.owner.userId),
    }));
  }

  async getPost(postId: number) {
    const post = await this.postRepo.findOne({
      relations: [
        'comments',
        'reacts',
        'owner',
        'reacts.owner',
        'comments.owner',
      ],
      where: { postId },
      select: ['comments', 'reacts', 'owner'],
    });

    return {
      ...post,
      reacts: post.reacts.map((react) => react.owner.userId),
      comments: post.comments.map((comment) => {
        return {
          ...comment,
          owner: {
            userId: comment.owner.userId,
            name: comment.owner.name,
            avatar: comment.owner.avatar,
          },
        };
      }),
      owner: {
        userId: post.owner.userId,
        name: post.owner.name,
        avatar: post.owner.avatar,
      },
    };
  }
}
