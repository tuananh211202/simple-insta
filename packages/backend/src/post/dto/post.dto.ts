import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty()
  postId?: number;

  @ApiProperty()
  imageUrl?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  mode?: string;
}
