import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/constants';

@ApiTags('Friend Request')
@Controller('friend-request')
export class FriendRequestController {
  constructor(private friendRequestService: FriendRequestService) {}

  @Get('relation/:id')
  getRelation(@Request() req, @Param('id') userId: number) {
    return this.friendRequestService.getRelation(req.user.sub, userId);
  }

  @Public()
  @Post('add/:senderId/:receiverId')
  createFriendRequest(
    @Param('senderId') senderId: number,
    @Param('receiverId') receiverId: number,
  ) {
    return this.friendRequestService.createFriendRequest(senderId, receiverId);
  }

  @Public()
  @Post('remove/:senderId/:receiverId')
  deleteFriendRequest(
    @Param('senderId') senderId: number,
    @Param('receiverId') receiverId: number,
  ) {
    return this.friendRequestService.deleteFriendRequest(senderId, receiverId);
  }

  @Get('list-friend')
  getlistFriend(@Request() req) {
    return this.friendRequestService.getListFriend(req.user.sub);
  }

  @Get('request')
  getRequest(@Request() req) {
    return this.friendRequestService.getListRequest(req.user.sub);
  }

  @Get('receiver')
  getReceiver(@Request() req) {
    return this.friendRequestService.getReceiverRequests(req.user.sub);
  }
}
