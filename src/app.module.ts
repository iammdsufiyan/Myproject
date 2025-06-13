import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { User } from './users/users.entity';
import { Post } from './posts/posts.entity';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // 
      database: 'testdb',
      entities: [User, Post],
      synchronize: true, 
      logging: true,
    
    }),
 CacheModule.registerAsync({
      useFactory: async () => ({
        // store: await redisStore(),
        host: 'localhost',
        port: 6379,
        ttl: 5,
      }),
      isGlobal: true, 
    }),
  
    UsersModule,
    PostsModule,
  ]
})
export class AppModule {}
