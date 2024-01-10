import { Module } from '@nestjs/common';
import { NotiController } from './noti.controller';
import { NotiService } from './noti.service';
import { NotiGateway } from './noti.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Noti } from './noti.entity';
import { UserModule } from 'src/user/user.module';
import { FriendRequestModule } from 'src/friend-request/friend-request.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Noti]),
    UserModule,
    FriendRequestModule,
    MessageModule,
  ],
  controllers: [NotiController],
  providers: [NotiService, NotiGateway],
  exports: [NotiService],
})
export class NotiModule {}
