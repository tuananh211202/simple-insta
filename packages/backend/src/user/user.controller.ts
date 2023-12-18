import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/constants';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get(':id')
  getUserById(@Param('id') userId: number){
    return this.userService.getUserById(userId);
  }
}
