import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  private userRepo;

  constructor(private dataSource: DataSource) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userRepo.find({ relations: ['posts'] });
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: +id },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  async create(@Body() data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
}
