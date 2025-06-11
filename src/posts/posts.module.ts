

import { PostsController } from './posts.controller';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from '../middleware/middleware';
import { UsersController } from 'src/users/users.controller';
@Module({

  controllers: [PostsController]
})
export class PostsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UsersController);
  }
}
