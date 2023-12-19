import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { FilterDto } from './dto/filter.dto';

export type ExampleUser = any;

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findOne(id: number) {
    return this.userRepo.findOneBy({ userId: id });
  }

  async getUserById(id: number) {
    const user = await this.findOne(id);
    delete user.password;
    return user;
  }

  async findOneByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async savedUser(user: UserDto) {
    return this.userRepo.save(user);
  }

  async getUsers(filter: FilterDto) {
    const { name, id } = filter;
    if (id.length === 0) {
      const users = await this.userRepo
        .createQueryBuilder('user')
        .select(['user.userId', 'user.name', 'user.email', 'user.avatar'])
        .where('user.name LIKE :query', { query: `%${name}%` })
        .getMany();

      return users;
    }
    if (name.length === 0) {
      const users = await this.userRepo
        .createQueryBuilder('user')
        .select(['user.userId', 'user.name', 'user.email', 'user.avatar'])
        .where('CAST(user.userId AS CHAR) LIKE :query', { query: `%${id}%` })
        .getMany();

      return users;
    }
    return [];
  }
}
