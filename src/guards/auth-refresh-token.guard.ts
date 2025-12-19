import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthRefreshTokenGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('Неверный токен');
    }

    try {
      const payload = await this.jwt.verifyAsync<Record<string, string>>(
        token,
        {
          secret: this.config.get<string>('JWT_SECRET_REFRESH'),
        },
      );

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Ошибка авторизации');
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return (request.cookies?.refresh_token as string) ?? undefined;
  }
}
