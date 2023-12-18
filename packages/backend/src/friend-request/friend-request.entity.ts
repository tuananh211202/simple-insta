import { User } from "src/user/user.entity";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  friendRequestId: number;

  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date;

  @ManyToOne(() => User, user => user.sentFriendRequests)
  sender: User;

  @ManyToOne(() => User, user => user.receivedFriendRequests)
  receiver: User;
}
