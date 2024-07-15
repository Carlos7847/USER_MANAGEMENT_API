import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    const user =
      await this.usersService.findOneByUsernameOrEmail(usernameOrEmail);
    if (user && (await bcrypt.compare(password, user.contraseña))) {
      const { ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Contraseña incorrecta');
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { ...user, contraseña: '******' },
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const user = await this.usersService.create(registerDto);
    const { contraseña, ...result } = user;
    return result;
  }
}
