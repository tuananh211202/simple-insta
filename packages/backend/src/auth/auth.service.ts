import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.userService.findOne(email);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    delete user.password;
    const payload = { sub: user.userId, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
