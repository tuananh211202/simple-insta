import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/constants';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get(':id')
  getUserById(@Param('id') userId: number) {
    return this.userService.getUserById(userId);
  }

  @Public()
  @Get('list')
  getUserByFilter(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('id') id: string = '',
    @Query('name') name: string = '',
  ) {
    return this.userService.getUsers({ id, name }, { page, pageSize });
  }
}
