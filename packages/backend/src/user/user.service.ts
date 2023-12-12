import { Injectable } from '@nestjs/common';

export type ExampleUser = any;

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: 1,
      email: 'john@gmail.com',
      password: 'changeme',
    },
    {
      userId: 2,
      email: 'maria@yahoo.com',
      password: 'guess',
    },
  ];

  async findOne(email: string): Promise<ExampleUser | undefined> {
    return this.users.find(user => user.email === email);
  }
}
