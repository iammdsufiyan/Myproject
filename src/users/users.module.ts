import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { LoggerMiddleware } from '../middleware/middleware.post';
import { UsersService } from './users.service';
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'users/create', method: RequestMethod.POST });
  }
}
