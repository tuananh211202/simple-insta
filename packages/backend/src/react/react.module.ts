import { Module } from '@nestjs/common';
import { ReactController } from './react.controller';
import { ReactService } from './react.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { React } from './react.entity';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([React]), UserModule, PostModule],
  controllers: [ReactController],
  providers: [ReactService],
})
export class ReactModule {}
