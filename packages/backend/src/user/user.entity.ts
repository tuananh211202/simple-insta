import { FriendRequest } from 'src/friend-request/friend-request.entity';
import { Message } from 'src/message/message.entity';
import { Noti } from 'src/noti/noti.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
