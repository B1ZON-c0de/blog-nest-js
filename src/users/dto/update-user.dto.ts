import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserUpdateInput } from 'generated/prisma/models';

export class UpdateUserDto implements UserUpdateInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
