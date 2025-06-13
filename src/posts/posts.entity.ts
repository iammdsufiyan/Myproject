import { Entity, Column, PrimaryGeneratedColumn, ManyToOne , JoinColumn} from 'typeorm';
import { User } from '../users/users.entity';
import { Exclude } from 'class-transformer';
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({nullable:true})
  location: string;

 
  @ManyToOne(() => User, (user) => user.posts)
   @JoinColumn({ name: 'userId' })
  user: User;
}