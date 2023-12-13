import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

export type ExampleUser = any;

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findOneByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async savedUser(user: UserDto) {
    return this.userRepo.save(user);
  }
}
