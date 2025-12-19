import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma/browser';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  async createToken(user: User) {
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      name: user.name,
    });
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, name: user.name, type: 'refresh' },
      {
        secret: this.config.get('JWT_SECRET_REFRESH'),
        expiresIn: this.config.get('JWT_EXPIRES_REFRESH'),
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const paylaod = await this.jwt.verifyAsync<Record<string, string>>(
      refreshToken,
      {
        secret: this.config.get('JWT_SECRET_REFRESH'),
      },
    );

    const newAccessToken = await this.jwt.signAsync({
      sub: paylaod.sub,
      name: paylaod.name,
    });

    return {
      accessToken: newAccessToken,
      refreshToken,
    };
  }
}
