import { Controller, Get, Post, Body } from '@nestjs/common';
import { Post as BlogPost } from './post.entity';
import { DataSource } from 'typeorm';

@Controller('posts')
export class PostsController {
  constructor(private dataSource: DataSource) {}

  @Get()
  async findAll(): Promise<BlogPost[]> {
    return this.dataSource.getRepository(BlogPost).find();
  }

  @Post()
  async create(@Body() data: Partial<BlogPost>): Promise<BlogPost> {
    const post = this.dataSource.getRepository(BlogPost).create(data);
    return this.dataSource.getRepository(BlogPost).save(post);
  }
}
