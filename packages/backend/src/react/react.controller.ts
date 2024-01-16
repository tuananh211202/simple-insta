import { Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { ReactService } from './react.service';

@Controller('react')
export class ReactController {
  constructor(private reactService: ReactService) {}

  @Post(':postId')
  async createReact(@Request() req, @Param('postId') postId: number) {
    return this.reactService.createReact(req.user.sub, postId);
  }

  @Delete(':postId')
  async deleteReact(@Request() req, @Param('postId') postId: number) {
    return this.reactService.deleteReact(req.user.sub, postId);
  }
}
