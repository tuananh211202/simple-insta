import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findOneByEmail(email);
    const isPasswordMatch = await this.comparePassword(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    delete user.password;
    const payload = { sub: user.userId, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async signUp(signupDto: SignupDto) {
    const { name, email, password, description } = signupDto;
    console.log(signupDto);
    const existUser = await this.userService.findOneByEmail(email);
    if (existUser) {
      throw new ConflictException();
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.savedUser({
      name,
      password: hashedPassword,
      email,
      description,
      avatar: '',
    });

    delete newUser.password;
    const payload = { sub: newUser.userId, email: newUser.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      newUser,
    };
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  async comparePassword(password: string, hashedPassword: string) {
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    return isPasswordMatch;
  }
}
