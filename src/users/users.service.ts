import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/dto.user';

export type User = {
  id: number;
  email: string;
  name: string;
  location: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

async findOne(email: string): Promise<User | undefined> {
  return this.users.find(user => user.email === email);
}
}