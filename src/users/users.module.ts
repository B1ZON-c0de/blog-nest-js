import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersMapInterceptor } from './users-map.interceptor';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [UsersController],
  providers: [UsersService, UsersMapInterceptor],
  exports: [UsersService],
})
export class UsersModule {}
