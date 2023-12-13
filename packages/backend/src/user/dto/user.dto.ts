import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'Kevin' })
  name?: string;

  @ApiProperty({ example: 'email@example.com' })
  email?: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  avatar?: string;
}
