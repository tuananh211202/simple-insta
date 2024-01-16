import { Body, Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(':postId')
  async createComment(
    @Request() req,
    @Param('postId') postId: number,
    @Body() commentDetails: { content: string },
  ) {
    return this.commentService.createComment(
      req.user.sub,
      postId,
      commentDetails.content,
    );
  }

  @Delete(':postId')
  async deleteComment(@Request() req, @Param('postId') postId: number) {
    return this.commentService.deleteComment(req.user.sub, postId);
  }
}
