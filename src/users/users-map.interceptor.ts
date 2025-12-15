import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UserOmit } from 'generated/prisma/models';
import { map } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class UsersMapInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((user: UserOmit) => {
        if (!user) {
          return { data: null };
        }

        return {
          data: {
            name: user.name,
            email: user.email,
            bio: user.bio,
            avatar: user.avatar,
          },
        };
      }),
    );
  }
}
