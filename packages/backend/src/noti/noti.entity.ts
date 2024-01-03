import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Noti {
  @PrimaryGeneratedColumn()
  notiId: number;

  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.noti)
  user: User;
}
