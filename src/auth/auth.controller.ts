import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  UnauthorizedException,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { HashService } from './hash.service';
import type { UserCreateInput } from 'generated/prisma/models';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import type { Request } from 'express';

import { AuthGuard } from 'src/guards/auth.guard';
import { AuthRefreshTokenGuard } from 'src/guards/auth-refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create({
      ...createUserDto,
      password: await this.hashService.hash(createUserDto.password),
    });
  }

  @Post('/login')
  async login(
    @Body() { email, password }: UserCreateInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.getUserFromEmail(email);

    if (user) {
      if (!(await this.hashService.compare(password, user.password))) {
        throw new UnauthorizedException();
      }

      const { accessToken, refreshToken } =
        await this.authService.createToken(user);

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        user: {
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
        },
        accessToken,
      };
    } else {
      throw new UnauthorizedException({
        status: 401,
        error: 'Неверный email или пароль',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');

    return { isExit: true };
  }
  @UseGuards(AuthRefreshTokenGuard)
  @Get('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = (req.cookies?.refresh_token as string) ?? undefined;
    const { accessToken } = await this.authService.refreshToken(refreshToken);

    return {
      newToken: accessToken,
    };
  }
}
