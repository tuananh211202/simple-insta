import { ApiProperty } from "@nestjs/swagger";


export class AppDto {
  @ApiProperty({ example: 'Kevin' })
  name: string;
}
