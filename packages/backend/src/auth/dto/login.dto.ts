import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: 'email@example.com' })
  email: string;

  @ApiProperty()
  password: string;
}
