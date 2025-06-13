import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository  } from 'typeorm';
import { Post } from './posts.entity';
import { User } from '../users/users.entity';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}
//    async getPostsWithUsers() {
//     return this.postRepo
//       .createQueryBuilder()
//       .select(['post', 'user'])
//       .from(Post, 'post')
//       .innerJoin(User, 'user', 'user.location = post.location')
//       .getRawMany();
//   }
  async getPostsWithUsersInnerJoin() {
  return await this.postRepo
    .createQueryBuilder('post')
    .innerJoinAndSelect('post.user', 'user') // INNER JOIN user ON post.userId = user.id
    .getMany();

   
}
  }

