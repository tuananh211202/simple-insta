import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class React {
  @PrimaryGeneratedColumn()
  reactId: number;

  @ManyToOne(() => Post, (post) => post.reacts)
  post: Post;

  @ManyToOne(() => User, (user) => user.reacts)
  owner: User;
}
