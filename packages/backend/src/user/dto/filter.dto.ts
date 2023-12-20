import { ApiProperty } from '@nestjs/swagger';

export class FilterDto {
  @ApiProperty()
  name: string;
}
