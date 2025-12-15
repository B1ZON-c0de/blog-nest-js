import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { HashService } from './hash.service';
import type { UserCreateInput } from 'generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  @Post('/signup')
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create({
      ...createUserDto,
      password: await this.hashService.hash(createUserDto.password),
    });
  }

  @Post('/login')
  async login(@Body() { email, password }: UserCreateInput) {
    const user = await this.usersService.getUserFromEmail(email);

    if (user) {
      if (!(await this.hashService.compare(password, user.password))) {
        throw new UnauthorizedException();
      }

      const paylaod = { sub: user.id, name: user.name };

      return {
        access_token: await this.jwt.signAsync(paylaod),
      };
    } else {
      throw new UnauthorizedException({
        status: 401,
        error: 'Неверный email или пароль',
      });
    }
  }
}
