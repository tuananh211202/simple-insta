import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from './comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    private userService: UserService,
    private postService: PostService,
  ) {}

  async createComment(userId: number, postId: number, content: string) {
    const user = await this.userService.findOne(userId);
    const post = await this.postService.findOne(postId);
    if (!user || !post) {
      throw new NotFoundException();
    }

    await this.commentRepo.save({
      post,
      owner: user,
      content,
      create_at: new Date(),
    });

    return;
  }

  async deleteComment(userId: number, postId: number) {
    const user = await this.userService.findOne(userId);
    const post = await this.postService.findOne(postId);
    if (!user || !post) {
      throw new NotFoundException();
    }

    const comment = await this.commentRepo.findOneBy({
      post,
      owner: user,
    });

    if (!comment) return;

    return this.commentRepo.delete(comment);
  }
}
