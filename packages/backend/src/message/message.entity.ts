import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  messageId: number;

  @Column()
  content: string;

  @Column({ type: 'timestamp' })
  create_at: Date;

  @ManyToOne(() => User, (user) => user.messageSender)
  sender: User;

  @ManyToOne(() => User, (user) => user.messageReceiver)
  receiver: User;
}