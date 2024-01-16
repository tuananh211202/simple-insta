import { Comment } from 'src/comment/comment.entity';
import { React } from 'src/react/react.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ModeType {
  PRIVATE = 'private',
  NORMAL = 'normal',
  PUBLIC = 'public',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column({ type: 'timestamp' })
  create_at: Date;

  @Column()
  imageUrl: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ModeType,
    default: ModeType.NORMAL,
  })
  mode: string;

  @ManyToOne(() => User, (user) => user.posts)
  owner: User;

  @OneToMany(() => React, (react) => react.post)
  reacts: React[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
