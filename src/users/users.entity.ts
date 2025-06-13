import { Entity, Column, PrimaryGeneratedColumn, OneToMany , EntitySchema } from 'typeorm';
import { Post } from '../posts/posts.entity';
import { Exclude } from 'class-transformer';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  // @Column({nullable:true})
  // location: string;
  
  
 @Column  ()
  location: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}