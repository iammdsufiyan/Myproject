import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { LoggerMiddleware } from '../middleware/middleware.post';
@Module({
  
  controllers: [UsersController]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'users/create', method: RequestMethod.POST });
  }
}
