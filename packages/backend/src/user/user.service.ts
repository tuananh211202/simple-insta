import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { FilterDto } from './dto/filter.dto';
import { PaginationOptions } from 'src/utils/constants';
import * as bcrypt from 'bcrypt';

export type ExampleUser = any;

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findOne(id: number) {
    return this.userRepo.findOneBy({ userId: id });
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOne({
      relations: ['posts', 'posts.reacts'],
      where: { userId: id },
      select: ['posts'],
    });
    if (!user) return {};
    delete user.password;
    return {
      ...user,
      reacts: user.posts.reduce((acc, ele) => acc + ele.reacts.length, 0),
      posts: user.posts.length,
    };
  }

  async findOneByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async savedUser(user: UserDto) {
    return this.userRepo.save(user);
  }

  async updateUser(userData: UserDto) {
    const user = await this.userRepo.findOneBy({ userId: userData.userId });
    if (!user) {
      throw new NotFoundException();
    }

    const savedUser = { ...user, ...userData };
    await this.userRepo.save(savedUser);

    return;
  }

  async getUsers(filter: FilterDto, pagOpts: PaginationOptions) {
    const { name } = filter;

    if (!name) return [];

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

      return { users, total: totalItems };
    }

    return { users: [], total: 0 };
  }

  async updatePassword(
    userId: number,
    updateData: {
      oldPassword: string;
      newPassword: string;
    },
  ) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }

    const isPasswordMatch = await bcrypt.compare(
      updateData.oldPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    const newPassword = await bcrypt.hash(updateData.newPassword, 10);

    await this.userRepo.save({
      ...user,
      password: newPassword,
    });

    return;
  }
}
