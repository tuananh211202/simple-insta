import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'Kevin' })
  name: string;

  @ApiProperty({ example: 'email@example.com' })
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  description: string;
}
