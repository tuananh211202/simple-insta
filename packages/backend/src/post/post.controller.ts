import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { Public } from 'src/auth/constants';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('upload')
  async createPost(@Request() req, @Body() postDetail: PostDto) {
    return this.postService.createPost(req.user.sub, postDetail);
  }

  @Get('list/:userId')
  async getList(
    @Param('userId') userId: number,
    @Query('isOwner', ParseIntPipe) isOwner = 1,
  ) {
    return this.postService.getList(userId, isOwner);
  }

  @Get('posts')
  async getPosts(@Request() req) {
    return this.postService.getPosts(req.user.sub);
  }

  @Public()
  @Get('full/:postId')
  async getPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.getPost(postId);
  }
}
