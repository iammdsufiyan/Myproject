import { Controller, Get, Post, Body, Param, NotFoundException ,UseInterceptors,Inject,Delete, Patch ,HttpException
, HttpStatus , ParseIntPipe , Query
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Validator } from 'class-validator';
import { CreatePostDto } from '../dto/dto.user';
import { ValidationPipe } from '@nestjs/common';
@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  private userRepo;
  constructor(private dataSource: DataSource, @Inject('CACHE_MANAGER') private cacheManager: Cache) {
    this.userRepo = this.dataSource.getRepository(User);
  }
  @Get('findAll')
  async findAll(): Promise<User[]> {
    //  try {
    //   await this.userRepo.findAll();
    // } catch (error) {
    //   throw new HttpException({
    //     status: HttpStatus.FORBIDDEN,
    //     error: 'This is a custom message',
    //   }, HttpStatus.FORBIDDEN, {
    //     cause: error
    //   });
    // }
    console.log('Fetching all users');
    const cacheKey = 'all_users';
    const cached = await this.cacheManager.get<User[]>(cacheKey);
    if (cached) {
      console.log('Returning users from cache');
      return cached;
    }
    const users = await this.userRepo.find({ relations: ['posts'] });
    await this.cacheManager.set(cacheKey, users);
    return users;
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: +id },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  @Post('create')
  async create(@Body(new ValidationPipe()) data: CreatePostDto): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
 @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: +id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepo.remove(user);
  }
@Patch(':id')
  async update(@Param('id') id: number, @Body() data: Partial<User>): Promise<User> { 
    const user = await this.userRepo.findOne({ where: { id: +id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, data);
    return this.userRepo.save(user);
  }
}