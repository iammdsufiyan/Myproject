import { Controller, Get, Post, Body ,Inject , Param ,NotFoundException , Delete } from '@nestjs/common';
import { Post as BlogPost } from './post.entity';
import { DataSource } from 'typeorm';
import { Cache } from 'cache-manager';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';
import { ExceptionFilter }  from '@nestjs/common';
import { UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../exception/exception.handle';
import { ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from '../dto/dto.user';
@Controller('posts')
export class PostsController {
  
  constructor(
    private dataSource: DataSource,
    @Inject('CACHE_MANAGER') private cacheManager: Cache ,
  ) {}
  @Get('findAll')
  async findAll(): Promise<BlogPost[]> {
  
     const cacheKey = 'all_posts';
    console.log('Checking Redis cache for posts');
    const cached = await this.cacheManager.get<BlogPost[]>(cacheKey);
    if (cached) {
      console.log('Returning posts from Redis cache');
      return cached;
    }
    
    const posts = await this.dataSource.getRepository(BlogPost).find();
     throw new ForbiddenException(); 
    await this.cacheManager.set(cacheKey, posts, 10);
    console.log('Stored posts in Redis cache');
    return posts;  
  }

  @Post('create')
  @UseFilters(new HttpExceptionFilter())
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
