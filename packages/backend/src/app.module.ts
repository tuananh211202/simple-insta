import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.entity';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { FriendRequest } from './friend-request/friend-request.entity';
import { NotiModule } from './noti/noti.module';
import { Noti } from './noti/noti.entity';
import { MessageModule } from './message/message.module';
import { Message } from './message/message.entity';
import { ImageModule } from './image/image.module';
import { PostModule } from './post/post.module';
import { Post } from './post/post.entity';
import { CommentModule } from './comment/comment.module';
import { ReactModule } from './react/react.module';
import { React } from './react/react.entity';
import { Comment } from './comment/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, FriendRequest, Noti, Message, Post, React, Comment],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    FriendRequestModule,
    NotiModule,
    MessageModule,
    ImageModule,
    PostModule,
    CommentModule,
    ReactModule,
  ],
})
export class AppModule {}
