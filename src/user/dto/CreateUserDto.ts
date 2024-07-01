import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'User bio', description: 'The bio of the user' })
  @IsString()
  bio: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateUserWrapperDto {
  @ApiProperty({
    type: CreateUserDto,
    description: 'The user details',
  })
  @IsNotEmpty()
  user: CreateUserDto;
}
