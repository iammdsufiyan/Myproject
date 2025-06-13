

import { PostsController } from './posts.controller';
import { Module, NestModule, MiddlewareConsumer, Post } from '@nestjs/common';
import { LoggerMiddleware } from '../middleware/middleware';
import { UsersController } from 'src/users/users.controller';
import { PostService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post as postss} from './posts.entity';
// src/posts/posts.module.ts
@Module({
  imports:[
    TypeOrmModule.forFeature([postss])
  ],
  providers: [PostService],
  controllers: [PostsController]
})
export class PostsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UsersController);
  }
}
