import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { React } from './react.entity';
import { PostService } from 'src/post/post.service';

@Injectable()
export class ReactService {
  constructor(
    @InjectRepository(React) private postRepo: Repository<React>,
    private userService: UserService,
    private postService: PostService,
  ) {}

  async createReact(userId: number, postId: number) {
    const user = await this.userService.findOne(userId);
    const post = await this.postService.findOne(postId);
    if (!user || !post) {
      throw new NotFoundException();
    }

    await this.postRepo.save({
      post,
      owner: user,
    });

    return;
  }

  async deleteReact(userId: number, postId: number) {
    const user = await this.userService.findOne(userId);
    const post = await this.postService.findOne(postId);
    if (!user || !post) {
      throw new NotFoundException();
    }

    const react = await this.postRepo.findOneBy({
      post,
      owner: user,
    });

    if (!react) return;

    return this.postRepo.delete(react);
  }
}
