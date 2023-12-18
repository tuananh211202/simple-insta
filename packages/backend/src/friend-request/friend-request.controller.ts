import { Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private friendRequestService: FriendRequestService) {}

  @Get(':id')
  getRelation(@Request() req, @Param('id') userId: number) {
    return this.friendRequestService.getRelation(req.user.sub, userId);
  }

  @Post('add/:id')
  createFriendRequest(@Request() req, @Param('id') userId: number) {
    return this.friendRequestService.createFriendRequest(req.user.sub, userId);
  }

  @Post('remove/:id')
  deleteFriendRequest(@Request() req, @Param('id') userId: number) {
    return this.friendRequestService.deleteFriendRequest(req.user.sub, userId);
  }
}
