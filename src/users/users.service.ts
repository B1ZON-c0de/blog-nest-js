import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateInput } from 'generated/prisma/models';
import { User } from 'generated/prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: UserCreateInput) {
    if (await this.prisma.user.findUnique({ where: { email: data.email } })) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    return this.prisma.user.create({ data });
  }

  async getUserFromId(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
  }

  async getUserFromEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    if (await this.prisma.user.findUnique({ where: { email: data.email } })) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data,
    });
  }
}
