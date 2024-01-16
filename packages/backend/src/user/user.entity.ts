import { FriendRequest } from 'src/friend-request/friend-request.entity';
import { Message } from 'src/message/message.entity';
import { Noti } from 'src/noti/noti.entity';
import { Post } from 'src/post/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { React } from 'src/react/react.entity';
import { Comment } from 'src/comment/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 20 })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  description: string;

  @Column()
  avatar: string;

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => Noti, (noti) => noti.user)
  noti: Noti[];

  @OneToMany(() => Message, (message) => message.sender)
  messageSender: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  messageReceiver: Message[];

  @OneToMany(() => Post, (post) => post.owner)
  posts: Post[];

  @OneToMany(() => React, (react) => react.owner)
  reacts: React[];

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments: Comment[];
}
