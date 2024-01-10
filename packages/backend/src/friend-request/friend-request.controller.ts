import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Friend Request')
@Controller('friend-request')
export class FriendRequestController {
  constructor(private friendRequestService: FriendRequestService) {}

  @Get('relation/:id')
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

  @Get('list-friend')
  getlistFriend(@Request() req) {
    return this.friendRequestService.getListFriend(req.user.sub);
  }
}
