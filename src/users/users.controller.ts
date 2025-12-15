import {
  Controller,
  Get,
  Param,
  UseGuards,
  Body,
  Delete,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'generated/prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    return this.usersService.getUserFromId(id);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.delete(id);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateUser(
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }
}
