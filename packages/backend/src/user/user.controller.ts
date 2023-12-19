import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/constants';
import { FilterDto } from './dto/filter.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get(':id')
  getUserById(@Param('id') userId: number) {
    return this.userService.getUserById(userId);
  }

  @Public()
  @Post('list')
  getUserByFilter(@Body() filterDto: FilterDto) {
    return this.userService.getUsers(filterDto);
  }
}
