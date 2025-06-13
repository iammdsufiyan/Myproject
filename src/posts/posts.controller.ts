import { Controller, Get, Post, Body ,Inject , Param ,NotFoundException , Delete ,UseInterceptors } from '@nestjs/common';
import { Post as BlogPost } from './posts.entity';
import { DataSource } from 'typeorm';
import { Cache } from 'cache-manager';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';
import { ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from '../dto/dto.user';
import { PostService } from './posts.service';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';
@Controller('posts')
@UseInterceptors(LoggingInterceptor)
export class PostsController {
  constructor(
    private dataSource: DataSource,
    private postService: PostService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}
  @Get('inner')
getInnerJoinedPosts() {
  console.log('Fetching posts inner join');
  return this.postService.getPostsWithUsersInnerJoin();
}
 @Get('findAll')
 async findAll(): Promise<BlogPost[]> {
   const cacheKey = 'all_posts';
   const cached = await this.cacheManager.get<BlogPost[]>(cacheKey);
   if (cached) {
     return cached;
   }
   const posts = await this.dataSource.getRepository(BlogPost).find();
   await this.cacheManager.set(cacheKey, posts, 10);
   return posts;
 }
@Get(':id')
async findOne(@Param('id') id: number): Promise<BlogPost> {
  const post = await this.dataSource.getRepository(BlogPost).findOne({ where: { id: +id } });
  if (!post) {
    throw new NotFoundException(`Post with ID ${id} not found`);
  }
  return post;
} 
  @Post('create')
  //@UseGuards(AuthGuard)
  // @UseFilters(new HttpExceptionFilter())
  async create(@Body(new ValidationPipe()) data: CreatePostDto): Promise<BlogPost> {
    const post = this.dataSource.getRepository(BlogPost).create(data);
    return this.dataSource.getRepository(BlogPost).save(post);
  }
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {    
    const post = await this.dataSource.getRepository(BlogPost).findOne({ where: { id: +id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    await this.dataSource.getRepository(BlogPost).remove(post);
  }
}
