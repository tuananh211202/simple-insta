import { ApiProperty } from '@nestjs/swagger';

export class NotiDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  userId: number;
}
