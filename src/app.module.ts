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
     TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '3306', 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
      entities: [User, Post],
        synchronize: true,
      }),
    }),
    CacheModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
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
