import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/constants';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get('id/:id')
  getUserById(@Param('id') userId: number) {
    return this.userService.getUserById(userId);
  }

  @Public()
  @Get('list')
  getUserByFilter(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 10,
    @Query('name') name: string | undefined,
  ) {
    return this.userService.getUsers({ name }, { page, pageSize });
  }

  @Post()
  updateUser(@Request() req, @Body() userData: UserDto) {
    return this.userService.updateUser({userId: req.user.sub, ...userData});
  }
}
