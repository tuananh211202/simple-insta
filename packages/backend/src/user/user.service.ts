import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { FilterDto } from './dto/filter.dto';
import { PaginationOptions } from 'src/utils/constants';

export type ExampleUser = any;

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findOne(id: number) {
    return this.userRepo.findOneBy({ userId: id });
  }

  async getUserById(id: number) {
    const user = await this.findOne(id);
    if(!user) return {};
    delete user.password;
    return user;
  }

  async findOneByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async savedUser(user: UserDto) {
    return this.userRepo.save(user);
  }

  async updateUser(userData: UserDto) {
    const user = await this.userRepo.findOneBy({ userId: userData.userId });
    if(!user) {
      throw new NotFoundException();
    }

    const savedUser = {...user, ...userData};
    await this.userRepo.save(savedUser);

    return;
  }

  async getUsers(filter: FilterDto, pagOpts: PaginationOptions) {
    const { name } = filter;

    if(!name) return [];

    const { page, pageSize } = pagOpts;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    if (name.length !== 0) {
      const [users, totalItems] = await this.userRepo
        .createQueryBuilder('user')
        .select(['user.userId', 'user.name', 'user.email', 'user.avatar'])
        .where('user.name LIKE :query', { query: `%${name}%` })
        .skip(skip)
        .take(take)
        .getManyAndCount();

      return {users, total: totalItems};
    }
    
    return {users: [], total: 0};
  }
}
