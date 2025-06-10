import { Controller, Get, Post, Body ,Inject} from '@nestjs/common';
import { Post as BlogPost } from './post.entity';
import { DataSource } from 'typeorm';
import { Cache } from 'cache-manager';
@Controller('posts')
export class PostsController {
  constructor(
    private dataSource: DataSource,
    @Inject('CACHE_MANAGER') private cacheManager: Cache ,
  ) {}
  @Get()
  async findAll(): Promise<BlogPost[]> {
     const cacheKey = 'all_posts';

    console.log('Checking Redis cache for posts');
    const cached = await this.cacheManager.get<BlogPost[]>(cacheKey);
    if (cached) {
      console.log('Returning posts from Redis cache');
      return cached;
    }
    
    const posts = await this.dataSource.getRepository(BlogPost).find();
    await this.cacheManager.set(cacheKey, posts, 10);
    console.log('Stored posts in Redis cache');
    return posts;  
  }

  @Post()
  async create(@Body() data: Partial<BlogPost>): Promise<BlogPost> {
    const post = this.dataSource.getRepository(BlogPost).create(data);
    return this.dataSource.getRepository(BlogPost).save(post);
  }
}
