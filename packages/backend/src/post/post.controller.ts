import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('upload')
  async createPost(@Request() req, @Body() postDetail: PostDto) {
    return this.postService.createPost(req.user.sub, postDetail);
  }

  @Get('list')
  async getList(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 10,
    @Request() req,
  ) {
    return this.postService.getList(req.user.sub, { page, pageSize });
  }

  @Get('posts')
  async getPosts(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 10,
    @Request() req,
  ) {
    return this.postService.getPosts(req.user.sub, { page, pageSize });
  }
}
