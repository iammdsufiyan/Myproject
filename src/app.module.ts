import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { User } from './users/users.entity';
import { Post } from './posts/posts.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
      envFilePath: '.env', // Path to your environment variables file
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'testdb',
      entities: [User, Post],
      synchronize: true,
    }),
    CacheModule.register({
      isGlobal: true, // Makes the cache available globally
      ttl: 5, // Time to live for cache entries in seconds
      max: 100, // Maximum number of items in the cache
    }),
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}
