import { Module } from '@nestjs/common';
import { NotiController } from './noti.controller';
import { NotiService } from './noti.service';
import { NotiGateway } from './noti.gateway';

@Module({
  controllers: [NotiController],
  providers: [NotiService, NotiGateway]
})
export class NotiModule {}
